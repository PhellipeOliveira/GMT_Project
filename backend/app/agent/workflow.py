"""
Grafo principal (workflow) do Agente GMT (Landing Page)

Recepciona leads, responde dúvidas (RAG), gera orçamentos, agenda reuniões,
faz nutrição por e-mail, dispara notificações e gera relatórios semanais.

Nós principais:
- parse_and_classify : classifica intenção e extrai slots (LLM + Pydantic)
- prepare_plan       : planeja múltiplas ações do turno (multi-intents)
- router             : valida slots e injeta lead_ref_ou_id
- route_intent       : decide o próximo nó conforme intent
- resolve_lead       : resolve referência de lead (uuid/email/telefone/nome)
- leads_agent        : subgrafo ReAct de leads (inclui qualificar/classificar)
- duvidas_agent      : subgrafo ReAct de dúvidas (RAG + escalada)
- orcamentos_agent   : subgrafo ReAct de orçamentos
- reunioes_agent     : subgrafo ReAct de reuniões
- handle_nutricao    : intents de nutrição por e-mail
- handle_relatorio   : geração de relatório semanal
- update_context     : consolida lead_atual e dispara notificações automáticas
- execute_pending    : injeta a próxima ação pendente e volta ao router
- respond_final      : produz a resposta final ao lead
"""

from typing import Any, Dict, List, Literal, Optional, TypedDict, Annotated
from types import SimpleNamespace

import os
import re
import json

from dotenv import load_dotenv
from langchain_core.messages import AnyMessage, AIMessage, HumanMessage, SystemMessage
from langchain_openai import ChatOpenAI
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
# Persistência: no LangGraph Studio (`langgraph dev`) o checkpointer é injetado
# pela plataforma; na API FastAPI usamos AsyncPostgresSaver (ver app/server/webapp.py).
from pydantic import BaseModel, ConfigDict

from app.agent.prompt import (
    PARSER_SYSTEM_PROMPT,
    PLAN_SYSTEM_PROMPT,
    FINALIZER_SYSTEM_PROMPT,
    CONVERSA_SYSTEM_PROMPT,
    LEAD_REACT_PROMPT,
    ORCAMENTO_REACT_PROMPT,
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
    has_pending,
    push_ai_response,
)

load_dotenv()


# ═══════════════════════════ Modelos LLM (config por tarefa via env) ═══════════════════════════
# Cada papel (DEFAULT, ORCAMENTOS, FINALIZER, PLANNER) pode ter um modelo próprio,
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
orcamentos_model = _chat_model("ORCAMENTOS", "gpt-5-nano", "medium", "low")
finalizer_model = _chat_model("FINALIZER", "gpt-5-nano", "low", "low")
planner_model = _chat_model("PLANNER", "gpt-5-nano", "medium", "low")


# ═══════════════════════════ Intents e constantes ═══════════════════════════
IntentLiteral = Literal[
    "lead_cadastrar", "lead_obter", "lead_buscar", "lead_listar", "lead_atualizar",
    "lead_qualificar", "lead_classificar",
    "duvida_responder", "duvida_escalar",
    "orcamento_criar", "orcamento_adicionar_item", "orcamento_calcular_totais",
    "orcamento_atualizar_corpo", "orcamento_listar", "orcamento_exportar",
    "reuniao_verificar_agenda", "reuniao_agendar", "reuniao_remarcar",
    "reuniao_cancelar", "reuniao_listar",
    "nutricao_iniciar", "nutricao_pausar", "nutricao_status",
    "relatorio_gerar", "listar_status_lead", "conversa_geral", "fora_de_escopo",
]

LEAD_INTENTS = {"lead_cadastrar", "lead_obter", "lead_buscar", "lead_listar",
                "lead_atualizar", "lead_qualificar", "lead_classificar"}
DUVIDA_INTENTS = {"duvida_responder", "duvida_escalar"}
ORCAMENTO_INTENTS = {"orcamento_criar", "orcamento_adicionar_item", "orcamento_calcular_totais",
                     "orcamento_atualizar_corpo", "orcamento_listar", "orcamento_exportar"}
REUNIAO_INTENTS = {"reuniao_verificar_agenda", "reuniao_agendar", "reuniao_remarcar",
                   "reuniao_cancelar", "reuniao_listar"}
NUTRICAO_INTENTS = {"nutricao_iniciar", "nutricao_pausar", "nutricao_status"}

INTENTS_REQUIRING_LEAD = {
    "lead_obter", "lead_atualizar", "lead_qualificar", "lead_classificar",
    "orcamento_criar", "orcamento_listar",
    "reuniao_agendar", "reuniao_listar",
    "nutricao_iniciar", "nutricao_pausar", "nutricao_status",
}

REQUIRED_SLOTS: Dict[str, List[str]] = {
    "lead_cadastrar": ["nome"],
    "lead_obter": ["lead_ref_ou_id"],
    "lead_buscar": ["consulta"],
    "lead_atualizar": ["lead_ref_ou_id"],
    "lead_qualificar": ["lead_ref_ou_id"],
    "lead_classificar": ["lead_ref_ou_id", "status_codigo"],
    "duvida_responder": ["pergunta"],
    "duvida_escalar": ["pergunta"],
    "orcamento_criar": ["titulo"],
    "orcamento_adicionar_item": ["orcamento_id", "descricao", "quantidade", "preco_unitario"],
    "orcamento_calcular_totais": ["orcamento_id"],
    "orcamento_atualizar_corpo": ["orcamento_id", "corpo_md"],
    "orcamento_exportar": ["orcamento_id"],
    "reuniao_agendar": ["data_hora"],
    "reuniao_remarcar": ["reuniao_id", "nova_data_hora"],
    "reuniao_cancelar": ["reuniao_id"],
    "nutricao_iniciar": ["lead_ref_ou_id"],
}

# Notificações automáticas disparadas após certas ações (efeitos colaterais)
# intent -> lista de (tipo_confirmacao_lead, tipo_alerta_equipe)
# reuniao_agendar NÃO está aqui de propósito: a tool `agendar_reuniao` já envia os
# e-mails detalhados (cliente com .ics + equipe) de forma deduplicada. Deixá-la aqui
# geraria um segundo e-mail genérico ("GMT — confirmacao reuniao").
AUTO_NOTIFY = {
    "lead_cadastrar": ("confirmacao_cadastro", "alerta_equipe_cadastro"),
    "orcamento_criar": ("confirmacao_orcamento", "alerta_equipe_orcamento"),
    "reuniao_remarcar": ("atualizacao_reuniao", "alerta_equipe_reuniao"),
    "duvida_escalar": (None, "alerta_equipe_escalada"),
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


class PlanAction(BaseModel):
    intent: IntentLiteral
    slots: List[str] = []
    model_config = ConfigDict(extra="forbid")


parser_llm = model.with_structured_output(ParserResponse)


# ═══════════════════════════ Planner (parsing robusto) ═══════════════════════════
def normalize_json_like(s: str) -> str:
    t = (s or "").strip()
    if t.startswith("actions="):
        t = "{" + t.replace("actions=", "\"actions\":", 1) + "}"
    if t.startswith("[") and t.endswith("]"):
        t = "{\"actions\": " + t + "}"
    t = re.sub(r"([,{]\s*)([A-Za-z_][A-Za-z0-9_\-]*)\s*:", r'\1"\2":', t)
    t = t.replace("'", '"')
    return t


def parse_plan_actions_from_text(text: str) -> List[Dict[str, Any]]:
    raw = (text or "").strip()
    try:
        obj = json.loads(raw)
    except Exception:
        m = re.search(r"\{.*\bactions\b\s*:\s*\[.*\]\s*\}", raw, re.DOTALL)
        snippet = normalize_json_like(m.group(0)) if m else normalize_json_like(raw)
        try:
            obj = json.loads(snippet)
        except Exception:
            obj = None
    if not isinstance(obj, dict):
        return []
    actions = obj.get("actions")
    if not isinstance(actions, list):
        return []
    cleaned: List[Dict[str, Any]] = []
    for it in actions:
        if not isinstance(it, dict):
            continue
        intent = it.get("intent")
        slots = it.get("slots", [])
        if isinstance(slots, dict):
            slots = [json.dumps(slots, ensure_ascii=False)]
        elif not isinstance(slots, list):
            slots = []
        if intent:
            cleaned.append({"intent": intent, "slots": slots})
    return cleaned


class PlannerWrapper:
    def __init__(self, llm):
        self._llm = llm

    def invoke(self, msgs):
        resp = self._llm.invoke(msgs)
        txt = extract_text_content(resp)
        actions = parse_plan_actions_from_text(txt)
        return SimpleNamespace(actions=[
            SimpleNamespace(intent=a.get("intent"), slots=a.get("slots", [])) for a in actions
        ])


plan_llm = PlannerWrapper(planner_model)


def slots_strings_to_dict(slots_strings: List[str]) -> Dict[str, Any]:
    out: Dict[str, Any] = {}
    for s in slots_strings or []:
        if not isinstance(s, str):
            continue
        txt = s.strip()
        if txt.startswith("{") and txt.endswith("}"):
            txt2 = re.sub(r"([,{]\s*)([A-Za-z_][A-Za-z0-9_\-]*)\s*:", r'\1"\2":', txt).replace("'", '"')
            try:
                data = json.loads(txt2)
                if isinstance(data, dict):
                    out.update(data)
                    continue
            except Exception:
                pass
        if "=" in txt:
            k, v = txt.split("=", 1)
            out[k.strip()] = v.strip()
    return out


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
    if intent in ORCAMENTO_INTENTS:
        return "handle_orcamentos"
    if intent in REUNIAO_INTENTS:
        return "handle_reunioes"
    if intent in NUTRICAO_INTENTS:
        return "handle_nutricao"
    if intent == "relatorio_gerar":
        return "handle_relatorio"
    return "respond_final"  # listar_status_lead, conversa_geral, fora_de_escopo


# ═══════════════════════════ Nós: parser e plano ═══════════════════════════
def parse_and_classify(state: AgentState) -> AgentState:
    messages = state.get("messages") or []
    parsed = parser_llm.invoke([SystemMessage(content=PARSER_SYSTEM_PROMPT), *messages])
    slots_dict = {}
    for slot_str in parsed.slots:
        if "=" in slot_str:
            name, value = slot_str.split("=", 1)
            slots_dict[name.strip()] = value.strip()
    return {"intent": parsed.intent, "slots": slots_dict}


def prepare_plan(state: AgentState) -> AgentState:
    messages = state.get("messages") or []
    ctx = ensure_context(state)
    pending = list(ctx.get("pending_actions") or [])
    try:
        plan = plan_llm.invoke([SystemMessage(content=PLAN_SYSTEM_PROMPT), *messages])
        primary_intent = state.get("intent")
        lead_ctx = state.get("lead_atual")
        new_actions: List[Dict[str, Any]] = []
        for a in plan.actions or []:
            intent_a = a.intent
            if primary_intent and intent_a == primary_intent:
                continue
            if intent_a == "lead_cadastrar" and lead_ctx and lead_ctx.get("lead_id"):
                continue
            raw = getattr(a, "slots", None)
            norm = dict(raw) if isinstance(raw, dict) else slots_strings_to_dict(list(raw or []))
            if intent_a == "orcamento_criar" and "moeda" not in norm:
                norm["moeda"] = "EUR"
            if intent_a in INTENTS_REQUIRING_LEAD and not norm.get("lead_ref_ou_id"):
                if lead_ctx and lead_ctx.get("lead_id"):
                    norm["lead_ref_ou_id"] = str(lead_ctx["lead_id"])
            new_actions.append({"intent": intent_a, "slots": norm})

        def k(x):
            return (x.get("intent"), tuple(sorted((x.get("slots") or {}).items())))
        keys = {k(x) for x in pending}
        for act in new_actions:
            if k(act) not in keys:
                pending.append(act)
                keys.add(k(act))
    except Exception as e:
        ctx["planner_error"] = str(e)

    if pending:
        ctx["pending_actions"] = pending

    # Antecipa lead_cadastrar se a intent atual exige lead e não temos referência
    intent = state.get("intent")
    slots = dict(state.get("slots") or {})
    needs_lead = intent in INTENTS_REQUIRING_LEAD and not (
        slots.get("lead_ref_ou_id") or (state.get("lead_atual") and state["lead_atual"].get("lead_id"))
    )
    if needs_lead and pending:
        for i, act in enumerate(pending):
            if act.get("intent") == "lead_cadastrar":
                lead_action = pending.pop(i)
                ctx["pending_actions"] = pending
                return {"context": ctx, "intent": "lead_cadastrar", "slots": dict(lead_action.get("slots") or {})}
    return {"context": ctx}


# ═══════════════════════════ Nó: router ═══════════════════════════
def router_node(state: AgentState) -> AgentState:
    intent = state.get("intent")
    slots = dict(state.get("slots") or {})
    errors = list(state.get("errors") or [])
    context = ensure_context(state)
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
    updates: AgentState = {"slots": slots, "context": context}
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


# ═══════════════════════════ Nó: nutrição ═══════════════════════════
def handle_nutricao(state: AgentState) -> AgentState:
    intent = state["intent"]
    slots = state["slots"]
    la = state.get("lead_atual")
    lead_ref = slots.get("lead_ref_ou_id") or (la.get("lead_id") if la else None)
    if not lead_ref:
        return {"messages": AIMessage(content="Preciso identificar o lead para a nutrição.")}
    ctx = ensure_context(state)
    seq = slots.get("sequencia", "boas_vindas")
    if intent == "nutricao_iniciar":
        result = gmt_tools.iniciar_sequencia_nutricao.invoke({"lead_ref_ou_id": str(lead_ref), "sequencia": seq})
    elif intent == "nutricao_pausar":
        result = gmt_tools.pausar_sequencia_nutricao.invoke({"lead_ref_ou_id": str(lead_ref), "sequencia": seq})
    else:
        result = gmt_tools.status_sequencia_nutricao.invoke({"lead_ref_ou_id": str(lead_ref), "sequencia": slots.get("sequencia")})
    if result.get("error"):
        msg = result["error"].get("message", "Erro na nutrição.")
        push_ai_response(ctx, intent, msg, ok=False, data={"lead_ref": str(lead_ref)})
        return {"context": ctx, "messages": AIMessage(content=msg)}
    push_ai_response(ctx, intent, result.get("message", "Nutrição processada"), ok=True, data=result.get("data", {}))
    return {"context": ctx, "messages": AIMessage(content=result.get("message", "Nutrição processada"))}


# ═══════════════════════════ Nó: relatório semanal ═══════════════════════════
def handle_relatorio(state: AgentState) -> AgentState:
    intent = state["intent"]
    slots = state["slots"]
    ctx = ensure_context(state)
    result = gmt_tools.gerar_relatorio_semanal.invoke({
        "periodo_inicio": slots.get("periodo_inicio"),
        "periodo_fim": slots.get("periodo_fim"),
    })
    if result.get("error"):
        msg = result["error"].get("message", "Erro ao gerar relatório.")
        push_ai_response(ctx, intent, msg, ok=False)
        return {"context": ctx, "messages": AIMessage(content=msg)}
    data = result.get("data", {})
    # notifica o proprietário (log)
    try:
        gmt_tools.notificar_equipe_email.invoke({
            "tipo": "relatorio_semanal",
            "assunto": f"Relatório semanal GMT ({data.get('periodo')})",
            "referencia_id": str(data.get("relatorio_id")),
        })
    except Exception:
        pass
    msg = f"Relatório semanal gerado ({data.get('periodo')}) e enviado ao proprietário."
    push_ai_response(ctx, intent, msg, ok=True, data=data)
    return {"context": ctx, "messages": AIMessage(content=msg)}


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

    # Injeta lead_ref nas ações pendentes que exigem lead
    try:
        pending_now = list(ctx.get("pending_actions") or [])
        if new_lead and pending_now:
            lead_id_str = str(new_lead.get("lead_id")) if new_lead.get("lead_id") else None
            for act in pending_now:
                a_intent = act.get("intent")
                a_slots = dict(act.get("slots") or {})
                if a_intent in INTENTS_REQUIRING_LEAD and lead_id_str and not a_slots.get("lead_ref_ou_id"):
                    a_slots["lead_ref_ou_id"] = lead_id_str
                    act["slots"] = a_slots
                if a_intent == "orcamento_criar" and "moeda" not in a_slots:
                    a_slots["moeda"] = "EUR"
                    act["slots"] = a_slots
            ctx["pending_actions"] = pending_now
    except Exception:
        pass

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

    if intent == "listar_status_lead":
        try:
            res = gmt_tools.listar_status_lead.invoke({})
            items = (res.get("data") or {}).get("items", [])
            codigos = ", ".join(str(it.get("codigo")) for it in items) if items else "nenhum"
            msg = f"Status de lead válidos: {codigos}."
        except Exception:
            msg = "Não foi possível listar os status agora."
        push_ai_response(ctx, intent, msg, ok=True)
        return {"context": ctx, "messages": AIMessage(content=msg)}

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
        last = state["messages"][-1]
        return {"context": ctx, "messages": AIMessage(content=(extract_text_content(last) or ""))}

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
graph.add_node("prepare_plan", prepare_plan)
graph.add_node("router", router_node)
graph.add_node("resolve_lead", resolve_lead)
graph.add_node("handle_nutricao", handle_nutricao)
graph.add_node("handle_relatorio", handle_relatorio)
graph.add_node("update_context", update_context)
graph.add_node("respond_final", respond_final)

# ── Subgrafos ReAct ──
leads_agent_graph = new_react.create_react_executor(
    model=model,
    tools=[gmt_tools.cadastrar_lead, gmt_tools.obter_lead, gmt_tools.buscar_leads,
           gmt_tools.listar_leads, gmt_tools.atualizar_lead, gmt_tools.qualificar_lead,
           gmt_tools.classificar_lead, gmt_tools.resolver_lead],
    prompt=LEAD_REACT_PROMPT, prompt_vars=["intent", "slots", "lead_atual"],
)
graph.add_node("leads_agent", leads_agent_graph)

duvidas_agent_graph = new_react.create_react_executor(
    model=model,
    tools=[gmt_tools.responder_duvida_rag, gmt_tools.escalar_duvida_humano],
    prompt=DUVIDA_REACT_PROMPT, prompt_vars=["intent", "slots"],
)
graph.add_node("duvidas_agent", duvidas_agent_graph)

orcamentos_agent_graph = new_react.create_react_executor(
    model=orcamentos_model,
    tools=[gmt_tools.criar_orcamento, gmt_tools.adicionar_item_orcamento,
           gmt_tools.calcular_totais_orcamento, gmt_tools.listar_orcamentos,
           gmt_tools.exportar_orcamento, gmt_tools.atualizar_corpo_orcamento, gmt_tools.resolver_lead],
    prompt=ORCAMENTO_REACT_PROMPT, prompt_vars=["intent", "slots", "lead_atual"],
)
graph.add_node("orcamentos_agent", orcamentos_agent_graph)

reunioes_agent_graph = new_react.create_react_executor(
    model=model,
    tools=[gmt_tools.verificar_disponibilidade, gmt_tools.agendar_reuniao,
           gmt_tools.remarcar_reuniao, gmt_tools.cancelar_reuniao,
           gmt_tools.listar_reunioes, gmt_tools.resolver_lead],
    prompt=REUNIAO_REACT_PROMPT, prompt_vars=["intent", "slots", "lead_atual"],
)
graph.add_node("reunioes_agent", reunioes_agent_graph)


# ── Nó: execução de pendências ──
def execute_pending(state: AgentState) -> AgentState:
    ctx = ensure_context(state)
    pending = ctx.get("pending_actions") or []
    if not pending:
        return {}
    action = pending.pop(0)
    act_slots = dict(action.get("slots") or {})
    if not act_slots.get("lead_ref_ou_id"):
        la = state.get("lead_atual")
        if la and la.get("lead_id"):
            act_slots["lead_ref_ou_id"] = str(la["lead_id"])
    ctx["pending_actions"] = pending
    return {"context": ctx, "intent": action.get("intent"), "slots": act_slots}


graph.add_node("execute_pending", execute_pending)

# ── Edges ──
graph.add_edge(START, "parse_and_classify")
graph.add_edge("parse_and_classify", "prepare_plan")
graph.add_edge("prepare_plan", "router")

graph.add_conditional_edges(
    "router", route_intent,
    {
        "resolve_lead": "resolve_lead",
        "handle_leads": "leads_agent",
        "handle_duvidas": "duvidas_agent",
        "handle_orcamentos": "orcamentos_agent",
        "handle_reunioes": "reunioes_agent",
        "handle_nutricao": "handle_nutricao",
        "handle_relatorio": "handle_relatorio",
        "respond_final": "respond_final",
    },
)

graph.add_edge("resolve_lead", "router")
graph.add_edge("leads_agent", "update_context")
graph.add_edge("duvidas_agent", "update_context")
graph.add_edge("orcamentos_agent", "update_context")
graph.add_edge("reunioes_agent", "update_context")
graph.add_edge("handle_nutricao", "update_context")
graph.add_edge("handle_relatorio", "update_context")

graph.add_conditional_edges("update_context", has_pending,
                            {"execute": "execute_pending", "done": "respond_final"})
graph.add_edge("execute_pending", "router")
graph.add_edge("respond_final", END)

# Sem checkpointer aqui: o LangGraph Studio/API provê a persistência.
# A API self-hosted compila este mesmo `graph` com AsyncPostgresSaver.
compiled_graph = graph.compile()
