"""
Grafo principal (workflow) do Agente GMT - Fase 1 (Rececao Digital).

Fluxo linear e rapido para:
- captacao e gestao de leads
- resposta de duvidas via RAG
- verificacao/agendamento de reunioes
"""

from typing import Any, Dict, List, Literal, Optional, TypedDict, Annotated

import json
import os
import re

from dotenv import load_dotenv
from langchain_core.messages import AnyMessage, AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
# Persistência: no LangGraph Studio (`langgraph dev`) o checkpointer é injetado
# pela plataforma; na API FastAPI usamos AsyncPostgresSaver (ver app/server/webapp.py).
from pydantic import BaseModel

from app.agent.prompt import (
    PARSER_SYSTEM_PROMPT,
    FINALIZER_SYSTEM_PROMPT,
    CONVERSA_SYSTEM_PROMPT,
    LEAD_REACT_PROMPT,
    REUNIAO_REACT_PROMPT,
    DUVIDA_REACT_PROMPT,
)
from app.agent import tools as gmt_tools
from app.agent import new_react
from app.agent.helpers import (
    extract_text_content,
    ensure_context,
    lead_context_from_result,
    get_lead_context,
    extract_ref_from_text,
    push_ai_response,
)

load_dotenv()


# ═══════════════════════════ Modelos LLM (config por tarefa via env) ═══════════════════════════
# Cada papel (DEFAULT e FINALIZER) pode ter um modelo proprio,
# permitindo usar modelos mais baratos em tarefas simples e mais robustos nas complexas.
# Precedência do nome do modelo: LLM_MODEL_<PAPEL> > LLM_MODEL_DEFAULT > default do código.
# Parâmetros de reasoning/verbosity só se aplicam a modelos gpt-5 (responses API); para
# outros modelos (ex.: gpt-4o-mini) usa-se LLM_TEMPERATURE_<PAPEL> quando definido.
def _chat_model(papel: str, default_model: str, default_effort: str, default_verbosity: str) -> ChatOpenAI:
    name = (
        os.getenv(f"LLM_MODEL_{papel}")
        or os.getenv("LLM_MODEL_DEFAULT")
        or default_model
    )
    kwargs: dict = {"model": name}
    if name.startswith("gpt-5"):
        kwargs["output_version"] = "responses/v1"
        kwargs["reasoning"] = {"effort": os.getenv(f"LLM_EFFORT_{papel}", default_effort)}
        kwargs["verbosity"] = os.getenv(f"LLM_VERBOSITY_{papel}", default_verbosity)
    else:
        temp = os.getenv(f"LLM_TEMPERATURE_{papel}")
        if temp is not None:
            try:
                kwargs["temperature"] = float(temp)
            except ValueError:
                pass
    return ChatOpenAI(**kwargs)


model = _chat_model("DEFAULT", "gpt-5-nano", "low", "low")
finalizer_model = _chat_model("FINALIZER", "gpt-5-nano", "low", "low")


# ═══════════════════════════ Intents e constantes ═══════════════════════════
IntentLiteral = Literal[
    "lead_cadastrar", "lead_obter", "lead_buscar", "lead_listar", "lead_atualizar",
    "duvida_responder",
    "reuniao_verificar_agenda", "reuniao_sugerir_horarios", "reuniao_agendar",
    "reuniao_remarcar", "reuniao_cancelar", "reuniao_listar",
    "conversa_geral", "fora_de_escopo",
]

LEAD_INTENTS = {"lead_cadastrar", "lead_obter", "lead_buscar", "lead_listar", "lead_atualizar"}
DUVIDA_INTENTS = {"duvida_responder"}
REUNIAO_INTENTS = {"reuniao_verificar_agenda", "reuniao_sugerir_horarios",
                   "reuniao_agendar", "reuniao_remarcar",
                   "reuniao_cancelar", "reuniao_listar"}

# Intents não permitidas no chat público (risco de enumeração/PII).
PUBLIC_BLOCKED_INTENTS = {
    "lead_obter",
    "lead_buscar",
    "lead_listar",
    "lead_atualizar",
    "reuniao_listar",
}

INTENTS_REQUIRING_LEAD = {
    "lead_obter", "lead_atualizar",
    "reuniao_agendar", "reuniao_listar",
}

REQUIRED_SLOTS: Dict[str, List[str]] = {
    "lead_cadastrar": ["nome"],
    "lead_obter": ["lead_ref_ou_id"],
    "lead_buscar": ["consulta"],
    "lead_atualizar": ["lead_ref_ou_id"],
    "duvida_responder": ["pergunta"],
    "reuniao_agendar": ["data_hora"],
    "reuniao_remarcar": ["email"],
    "reuniao_cancelar": ["email"],
}

# Notificações automáticas disparadas após certas ações (efeitos colaterais)
# intent -> lista de (tipo_confirmacao_lead, tipo_alerta_equipe)
# reuniao_agendar NÃO está aqui de propósito: a tool `agendar_reuniao` já envia os
# e-mails detalhados (cliente com .ics + equipe) de forma deduplicada. Deixá-la aqui
# geraria um segundo e-mail genérico ("GMT — confirmacao reuniao").
AUTO_NOTIFY = {
    "lead_cadastrar": ("confirmacao_cadastro", "alerta_equipe_cadastro"),
}


# ═══════════════════════════ Pydantic ═══════════════════════════
class ParserResponse(BaseModel):
    intent: IntentLiteral
    slots: List[str]


class AgentState(TypedDict, total=False):
    messages: Annotated[list[AnyMessage], add_messages]
    intent: IntentLiteral
    slots: Dict[str, Any]
    lead_atual: Optional[Dict[str, Any]]
    errors: List[str]
    context: Dict[str, Any]
    tool_result: Dict[str, Any]


parser_llm = model.with_structured_output(ParserResponse)
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")


# ═══════════════════════════ Roteamento ═══════════════════════════
def route_intent(state: AgentState) -> str:
    intent = state.get("intent")
    ctx = state.get("context") or {}
    if ctx.get("need_lead_resolution"):
        return "resolve_lead"
    if intent in LEAD_INTENTS:
        return "handle_leads"
    if intent in DUVIDA_INTENTS:
        return "handle_duvidas"
    if intent in REUNIAO_INTENTS:
        return "handle_reunioes"
    return "respond_final"


# ═══════════════════════════ Nó: parse_and_classify ═══════════════════════════
def parse_and_classify(state: AgentState) -> AgentState:
    messages = state.get("messages") or []
    parsed = parser_llm.invoke([SystemMessage(content=PARSER_SYSTEM_PROMPT), *messages])
    slots_dict = {}
    for slot_str in parsed.slots:
        if "=" in slot_str:
            name, value = slot_str.split("=", 1)
            slots_dict[name.strip()] = value.strip()
    return {"intent": parsed.intent, "slots": slots_dict}


def _is_valid_email(s: str) -> bool:
    return bool(s and EMAIL_RE.match((s or "").strip()))


def _latest_human_text(messages: List[AnyMessage]) -> str:
    for m in reversed(messages or []):
        if isinstance(m, HumanMessage):
            return extract_text_content(m).strip()
    return ""


def _previous_ai_text(messages: List[AnyMessage]) -> str:
    seen_human = False
    for m in reversed(messages or []):
        if isinstance(m, HumanMessage):
            if not seen_human:
                seen_human = True
                continue
            break
        if seen_human and isinstance(m, AIMessage):
            return extract_text_content(m).strip()
    return ""


def _is_short_affirmation(text: str) -> bool:
    cleaned = re.sub(r"[^\w\s]", "", (text or "").strip().lower())
    return cleaned in {"sim", "ok", "certo", "claro", "quero", "pode", "pode ser", "yes", "y"}


# ═══════════════════════════ Nó: router ═══════════════════════════
def router_node(state: AgentState) -> AgentState:
    intent = state.get("intent")
    slots = dict(state.get("slots") or {})
    errors = list(state.get("errors") or [])
    context = ensure_context(state)
    lead_atual_update = None
    messages = state.get("messages") or []

    # Evita regressão de UX: quando o visitante confirma agendamento e envia nome/e-mail,
    # seguimos diretamente para o fluxo de reunião (cadastro permanece silencioso).
    if intent == "lead_cadastrar":
        user_text = _latest_human_text(messages).lower()
        prev_ai_text = _previous_ai_text(messages).lower()
        has_identity = bool(slots.get("email") or slots.get("nome"))
        mentions_schedule = any(
            token in user_text
            for token in ("agendar", "agendamento", "reunião", "reuniao", "marcar", "horário", "horario")
        )
        invited_to_schedule = any(
            token in prev_ai_text
            for token in ("quer que eu agende", "podemos marcar", "agendar uma reunião", "marcar uma sessão")
        )
        if mentions_schedule or (has_identity and _is_short_affirmation(user_text) and invited_to_schedule):
            intent = "reuniao_agendar" if slots.get("data_hora") else "reuniao_sugerir_horarios"
            context["intent_rewritten"] = "lead_cadastrar->reuniao_fluxo"

    # Guardrail anti-prompt-injection: bloqueia intents sensíveis no chat público.
    if intent in PUBLIC_BLOCKED_INTENTS:
        context["security_blocked"] = True
        context["security_reason"] = f"intent_bloqueada:{intent}"
        context["security_forced_reply"] = (
            "Para proteger os dados dos clientes, não posso consultar ou alterar cadastros diretamente no chat. "
            "Posso ajudar com dúvidas, novo agendamento ou enviar um link seguro para gerir a sua reunião por e-mail."
        )
        return {"intent": "conversa_geral", "context": context}

    # Validação de e-mail para fluxos sensíveis.
    if intent in {"reuniao_remarcar", "reuniao_cancelar"}:
        email = str(slots.get("email") or "").strip().lower()
        if email and not _is_valid_email(email):
            slots.pop("email", None)
            errors.append("Para continuar, preciso de um e-mail válido (ex.: nome@dominio.com).")

    # Cadastro silencioso por e-mail/nome para popular lead_atual sem expor lead_id ao visitante.
    if slots.get("email") and not (state.get("lead_atual") and state["lead_atual"].get("lead_id")):
        payload = {"email": slots["email"], "origem": "chat_site"}
        if slots.get("nome"):
            payload["nome"] = slots["nome"]
        if slots.get("telefone"):
            payload["telefone"] = slots["telefone"]
        try:
            resp = gmt_tools.cadastrar_lead.invoke(payload)
            if not (resp or {}).get("error"):
                lead_ctx = lead_context_from_result(resp or {})
                if lead_ctx and lead_ctx.get("lead_id"):
                    lead_atual_update = lead_ctx
                    slots["lead_ref_ou_id"] = str(lead_ctx["lead_id"])
        except Exception as e:
            __import__("logging").getLogger(__name__).warning(
                "Cadastro silencioso de lead falhou no router: %s", e
            )

    # Atualização silenciosa de nome quando o lead já existe e chega nome mais confiável.
    lead_base = dict(lead_atual_update or state.get("lead_atual") or {})
    if lead_base.get("lead_id") and slots.get("nome"):
        nome_novo = str(slots.get("nome")).strip()
        nome_atual = str(lead_base.get("nome") or "").strip()
        nome_atual_words = [w for w in nome_atual.split() if w]
        nome_parece_fallback = bool(
            nome_atual and "@" not in nome_atual and len(nome_atual_words) < 3
        )
        if nome_novo and (nome_atual != nome_novo or nome_parece_fallback):
            lead_base["nome"] = nome_novo
            lead_atual_update = lead_base
            try:
                gmt_tools.atualizar_lead.invoke(
                    {"lead_id": str(lead_base["lead_id"]), "nome": nome_novo}
                )
            except Exception as e:
                __import__("logging").getLogger(__name__).warning(
                    "Atualizacao silenciosa de nome falhou no router: %s", e
                )

    missing: List[str] = []
    for name in REQUIRED_SLOTS.get(intent or "", []):
        if name == "lead_ref_ou_id" and (
            slots.get(name) or (state.get("lead_atual") and state["lead_atual"].get("lead_id"))
        ):
            continue
        if slots.get(name) in (None, "", []):
            missing.append(name)
    if intent in INTENTS_REQUIRING_LEAD and not slots.get("lead_ref_ou_id"):
        la = state.get("lead_atual")
        if la and la.get("lead_id"):
            slots["lead_ref_ou_id"] = str(la["lead_id"])
        else:
            missing.append("lead_ref_ou_id")
    if missing:
        errors.append(f"Para {intent} preciso de: {', '.join(sorted(set(missing)))}.")
        context["router_missing"] = sorted(set(missing))
        context["router_blocked"] = True
        if (intent in INTENTS_REQUIRING_LEAD and "lead_ref_ou_id" in missing
                and not context.get("lead_resolution_attempted")):
            context["need_lead_resolution"] = True
    else:
        context.update({"router_missing": [], "router_blocked": False, "need_lead_resolution": False})
    if (intent in INTENTS_REQUIRING_LEAD and slots.get("lead_ref_ou_id")
            and not (state.get("lead_atual") and state["lead_atual"].get("lead_id"))
            and not context.get("lead_resolution_attempted")):
        context["need_lead_resolution"] = True
    updates: AgentState = {"slots": slots, "context": context, "intent": intent}
    if lead_atual_update:
        updates["lead_atual"] = lead_atual_update
    if errors:
        updates["errors"] = errors
    return updates


# ═══════════════════════════ Nó: resolve_lead ═══════════════════════════
def resolve_lead(state: AgentState) -> AgentState:
    slots = dict(state.get("slots") or {})
    context = ensure_context(state)
    context["lead_resolution_attempted"] = True
    la = state.get("lead_atual")
    if la and la.get("lead_id"):
        context.update({"need_lead_resolution": False, "router_blocked": False})
        return {"context": context}

    ref_slot = slots.get("lead_ref_ou_id")
    if ref_slot:
        try:
            resp = gmt_tools.obter_lead.invoke({"ref": str(ref_slot)})
        except Exception:
            resp = None
        lead_ctx = lead_context_from_result(resp or {})
        if lead_ctx:
            slots["lead_ref_ou_id"] = str(lead_ctx["lead_id"])
            context.update({"need_lead_resolution": False, "router_blocked": False})
            return {"slots": slots, "lead_atual": lead_ctx, "context": context}
        if resp and resp.get("error") and resp["error"].get("matches"):
            context.update({"matches": resp["error"]["matches"], "need_lead_resolution": False, "router_blocked": True})
            return {"context": context}

    messages = state.get("messages") or []
    text = extract_text_content(messages[-1]) if messages else ""
    ref_direct = extract_ref_from_text(text)
    if ref_direct:
        try:
            resp = gmt_tools.obter_lead.invoke({"ref": str(ref_direct)})
        except Exception:
            resp = None
        lead_ctx = lead_context_from_result(resp or {})
        if lead_ctx:
            slots["lead_ref_ou_id"] = str(lead_ctx["lead_id"])
            context.update({"need_lead_resolution": False, "router_blocked": False})
            return {"slots": slots, "lead_atual": lead_ctx, "context": context}

    context.update({"need_lead_resolution": False, "router_blocked": False})
    return {"context": context, "slots": slots}


# ═══════════════════════════ Nó: update_context (+ notificações automáticas) ═══════════════════════════
def update_context(state: AgentState) -> AgentState:
    slots = dict(state.get("slots") or {})
    ctx = ensure_context(state)
    if ctx.get("pending_actions") is None:
        ctx["pending_actions"] = []
    intent = state.get("intent")

    # Consolida lead_atual a partir de tool_result / segmentos
    new_lead = None
    tool_result = state.get("tool_result") or {}
    data = tool_result.get("data") or {}
    ref = data.get("lead_id") or data.get("lead_ref_ou_id") or slots.get("lead_ref_ou_id")
    if ref:
        new_lead = get_lead_context(ref)

    # Notificações automáticas (efeitos colaterais das intents concluídas)
    try:
        if intent in AUTO_NOTIFY:
            tipo_lead, tipo_equipe = AUTO_NOTIFY[intent]
            lead_ref = slots.get("lead_ref_ou_id") or (new_lead.get("lead_id") if new_lead else None)
            ref_id = str(data.get("orcamento_id") or data.get("reuniao_id") or data.get("duvida_id") or "")
            if tipo_lead and lead_ref:
                gmt_tools.enviar_email_confirmacao.invoke({
                    "lead_ref_ou_id": str(lead_ref),
                    "tipo": tipo_lead,
                    "assunto": f"GMT — {tipo_lead.replace('_', ' ')}",
                    "referencia_id": ref_id or None,
                })
            if tipo_equipe:
                gmt_tools.notificar_equipe_email.invoke({
                    "tipo": tipo_equipe,
                    "assunto": f"GMT — {tipo_equipe.replace('_', ' ')}",
                    "referencia_id": ref_id or None,
                    "lead_ref_ou_id": str(lead_ref) if lead_ref else None,
                })
            ctx.setdefault("notificacoes_disparadas", []).append(intent)
    except Exception as e:
        ctx["notify_error"] = str(e)

    updates: AgentState = {"slots": slots, "context": ctx}
    if new_lead:
        updates["lead_atual"] = new_lead
    return updates


# ═══════════════════════════ Nó: respond_final ═══════════════════════════
def respond_final(state: AgentState) -> AgentState:
    ctx = ensure_context(state)
    intent = state.get("intent")
    ai_resps = list(ctx.get("ai_responses") or [])

    forced = (ctx.get("security_forced_reply") or "").strip()
    if forced:
        ctx["security_forced_reply"] = ""
        return {"context": ctx, "messages": AIMessage(content=forced)}

    # Caminho conversacional: sem ações de ferramenta, resposta natural com
    # captação progressiva de lead e incentivo à reunião (CONVERSA_SYSTEM_PROMPT).
    if intent in ("conversa_geral", "fora_de_escopo"):
        user_text = ""
        for m in reversed(state.get("messages") or []):
            if isinstance(m, HumanMessage):
                user_text = extract_text_content(m)
                break
        la = state.get("lead_atual") or {}
        nome = la.get("nome")
        email = la.get("email")
        conhecido = (
            f"Lead conhecido — nome: {nome or '(desconhecido)'}, e-mail: {email or '(desconhecido)'}."
            if (nome or email)
            else "Lead ainda não identificado (sem nome/e-mail)."
        )
        escopo = "O pedido está FORA do escopo da GMT." if intent == "fora_de_escopo" else ""
        ctx_msg = "\n".join(p for p in [f"Mensagem do lead: {user_text}", conhecido, escopo] if p)
        try:
            conv = finalizer_model.invoke([
                SystemMessage(content=CONVERSA_SYSTEM_PROMPT),
                HumanMessage(content=ctx_msg),
            ])
            msg = extract_text_content(conv) or ""
        except Exception:
            msg = ""
        if not msg:
            msg = ("Posso ajudar com os serviços da GMT, um orçamento ou agendar uma reunião. "
                   "Como posso ajudar?")
        return {"context": ctx, "messages": AIMessage(content=msg)}

    user_text = ""
    for m in reversed(state.get("messages") or []):
        if isinstance(m, HumanMessage):
            user_text = extract_text_content(m)
            break
    actions_txt, errors_txt = [], []
    for seg in ai_resps:
        txt = (seg.get("text") or "").strip()
        if not txt:
            continue
        (errors_txt if not seg.get("ok", True) else actions_txt).append(txt)

    if not actions_txt and not errors_txt:
        # Fallback seguro: mesmo sem segmentos estruturados, sempre passa pelo
        # finalizador para evitar vazamento de termos técnicos/IDs na resposta final.
        last = state["messages"][-1]
        raw_reply = extract_text_content(last) or ""
        tool_result = state.get("tool_result") or {}
        parts = []
        if user_text:
            parts.append(f"Prompt do lead: {user_text}")
        if raw_reply:
            parts.append("Ações executadas:\n- " + raw_reply)
        if tool_result:
            try:
                data_txt = json.dumps(tool_result, ensure_ascii=False)
            except Exception:
                data_txt = str(tool_result)
            parts.append("Dados retornados pelas ferramentas:\n" + data_txt)
        final_msg = finalizer_model.invoke(
            [
                SystemMessage(content=FINALIZER_SYSTEM_PROMPT),
                HumanMessage(content="\n\n".join(parts)),
            ]
        )
        ctx["ai_responses"] = []
        return {"context": ctx, "messages": AIMessage(content=extract_text_content(final_msg) or "")}

    parts = []
    if user_text:
        parts.append(f"Prompt do lead: {user_text}")
    if actions_txt:
        parts.append("Ações executadas:\n" + "\n".join(f"- {t}" for t in actions_txt))
    if errors_txt:
        parts.append("Falhas:\n" + "\n".join(f"- {t}" for t in errors_txt))
    final_msg = finalizer_model.invoke([SystemMessage(content=FINALIZER_SYSTEM_PROMPT),
                                         HumanMessage(content="\n\n".join(parts))])
    ctx["ai_responses"] = []
    return {"context": ctx, "messages": AIMessage(content=extract_text_content(final_msg) or "")}


# ═══════════════════════════ Montagem do grafo ═══════════════════════════
graph = StateGraph(AgentState)
graph.add_node("parse_and_classify", parse_and_classify)
graph.add_node("router", router_node)
graph.add_node("resolve_lead", resolve_lead)
graph.add_node("update_context", update_context)
graph.add_node("respond_final", respond_final)

# ── Subgrafos ReAct ──
leads_agent_graph = new_react.create_react_executor(
    model=model,
    tools=[gmt_tools.cadastrar_lead],
    prompt=LEAD_REACT_PROMPT, prompt_vars=["intent", "slots", "lead_atual"],
)
graph.add_node("leads_agent", leads_agent_graph)

duvidas_agent_graph = new_react.create_react_executor(
    model=model,
    tools=[gmt_tools.responder_duvida_rag],
    prompt=DUVIDA_REACT_PROMPT, prompt_vars=["intent", "slots"],
)
graph.add_node("duvidas_agent", duvidas_agent_graph)

reunioes_agent_graph = new_react.create_react_executor(
    model=model,
    tools=[gmt_tools.verificar_disponibilidade, gmt_tools.sugerir_horarios_proximo_dia_util, gmt_tools.agendar_reuniao,
           gmt_tools.enviar_link_gestao_reuniao],
    prompt=REUNIAO_REACT_PROMPT, prompt_vars=["intent", "slots", "lead_atual"],
)
graph.add_node("reunioes_agent", reunioes_agent_graph)

# ── Edges ──
graph.add_edge(START, "parse_and_classify")
graph.add_edge("parse_and_classify", "router")

graph.add_conditional_edges(
    "router", route_intent,
    {
        "resolve_lead": "resolve_lead",
        "handle_leads": "leads_agent",
        "handle_duvidas": "duvidas_agent",
        "handle_reunioes": "reunioes_agent",
        "respond_final": "respond_final",
    },
)

graph.add_edge("resolve_lead", "router")
graph.add_edge("leads_agent", "update_context")
graph.add_edge("duvidas_agent", "update_context")
graph.add_edge("reunioes_agent", "update_context")
graph.add_edge("update_context", "respond_final")
graph.add_edge("respond_final", END)

# Sem checkpointer aqui: o LangGraph Studio/API provê a persistência.
# A API self-hosted compila este mesmo `graph` com AsyncPostgresSaver.
compiled_graph = graph.compile()
