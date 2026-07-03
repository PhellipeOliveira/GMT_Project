"""
Ferramentas (tools) do Agente GMT (Landing Page)

Cada tool mapeia uma intent do Cheat Sheet e usa o schema
`01_gmt_agent_schema.sql` (Supabase / Postgres).

Grupos:
- Leads (cadastro, busca, qualificação, classificação)
- Dúvidas / RAG
- Orçamentos
- Reuniões (agendamento)
- Nutrição por e-mail
- Notificações (e-mail confirmação/equipe)
- Relatório semanal
- Utilidades (resolver_lead, lookups, respond)
"""

import logging
import os
import re
from datetime import datetime, date, timedelta, timezone
from zoneinfo import ZoneInfo
from typing import Any, Dict, List, Optional, Tuple

import psycopg
from langchain_core.tools import tool
from dotenv import load_dotenv

load_dotenv()

logger = logging.getLogger(__name__)


# ─────────────────────────── Conexão (Supabase) ───────────────────────────
def get_db_url() -> str:
    """Monta a URL do Postgres/Supabase a partir de variáveis de ambiente.

    Alternativa: use SUPABASE_DB_URL diretamente (connection string do Supabase).
    """
    direct = os.getenv("SUPABASE_DB_URL") or os.getenv("DATABASE_URL")
    if direct:
        return direct
    user = os.getenv("DB_USER")
    pwd = os.getenv("DB_PASSWORD")
    host = os.getenv("DB_HOST")
    port = os.getenv("DB_PORT", "5432")
    name = os.getenv("DB_NAME", "postgres")
    if not all([user, pwd, host, name]):
        raise RuntimeError(
            "Defina SUPABASE_DB_URL ou DB_USER, DB_PASSWORD, DB_HOST, DB_NAME (e DB_PORT/DB_SSLMODE)."
        )
    sslmode = os.getenv("DB_SSLMODE", "require")
    return f"postgresql://{user}:{pwd}@{host}:{port}/{name}?sslmode={sslmode}"


def get_conn():
    return psycopg.connect(get_db_url())


# ─────────────────────────── Helpers ───────────────────────────
UUID_RE = re.compile(r"^[0-9a-fA-F-]{36}$")


def normalize_phone(s: str) -> str:
    return re.sub(r"\D+", "", s or "")


def is_uuid(s: str) -> bool:
    return bool(s) and bool(UUID_RE.match(s))


def resolve_lead_id_by_ref(cur, ref: str) -> Tuple[Optional[str], List[Dict[str, Any]]]:
    """Resolve um lead por referência natural (uuid/email/telefone/nome/empresa).
    Retorna (lead_id_ou_none, matches_para_desambiguacao)."""
    if not ref:
        return None, []
    ref = ref.strip()
    if is_uuid(ref):
        cur.execute("select id, nome, email, empresa from public.leads where id = %s", (ref,))
        row = cur.fetchone()
        return (row[0], []) if row else (None, [])
    if "@" in ref:
        cur.execute(
            "select id, nome, email, empresa from public.leads where lower(email)=lower(%s)", (ref,)
        )
        row = cur.fetchone()
        return (row[0], []) if row else (None, [])
    digits = normalize_phone(ref)
    if len(digits) >= 8:
        cur.execute(
            "select id, nome, email, empresa from public.leads "
            "where regexp_replace(telefone, '[^0-9]', '', 'g')=%s",
            (digits,),
        )
        row = cur.fetchone()
        return (row[0], []) if row else (None, [])
    like = f"%{ref.lower()}%"
    cur.execute(
        """
        select id, nome, email, empresa from public.leads
        where lower(nome) like %s or lower(empresa) like %s
        order by criado_em desc limit 5
        """,
        (like, like),
    )
    rows = cur.fetchall() or []
    if len(rows) == 1:
        return rows[0][0], []
    return None, [{"lead_id": r[0], "nome": r[1], "email": r[2], "empresa": r[3]} for r in rows]


# ═══════════════════════════ LEADS ═══════════════════════════
@tool
def cadastrar_lead(
    nome: str,
    email: Optional[str] = None,
    telefone: Optional[str] = None,
    empresa: Optional[str] = None,
    origem: str = "chat_site",
    consentimento_lgpd: bool = False,
) -> Dict[str, Any]:
    """Cadastra um lead. Exige nome e pelo menos email OU telefone."""
    if not nome:
        return {"error": {"message": "Campo 'nome' é obrigatório."}}
    if not (email or telefone):
        return {"error": {"message": "Informe pelo menos email ou telefone."}}
    with get_conn() as conn:
        with conn.cursor() as cur:
            if email:
                cur.execute("select 1 from public.leads where lower(email)=lower(%s)", (email,))
                if cur.fetchone():
                    return {"error": {"message": "Já existe lead com este email."}}
            if telefone:
                cur.execute(
                    "select 1 from public.leads where regexp_replace(telefone,'[^0-9]','','g')=%s",
                    (normalize_phone(telefone),),
                )
                if cur.fetchone():
                    return {"error": {"message": "Já existe lead com este telefone."}}
            cur.execute(
                """
                insert into public.leads (nome, email, telefone, empresa, origem, consentimento_lgpd)
                values (%s,%s,%s,%s,%s,%s) returning id
                """,
                (nome, email, telefone, empresa, origem, consentimento_lgpd),
            )
            lead_id = cur.fetchone()[0]
    # psycopg devolve colunas uuid como objetos uuid.UUID; convertemos para str
    # para garantir que o retorno seja JSON-serializável (o ToolNode do subgrafo
    # ReAct serializa o dict via json.dumps, e um UUID cru quebraria essa etapa,
    # impedindo a propagação de tool_result -> lead_atual -> lead_id).
    return {"message": "Lead cadastrado", "data": {"lead_id": str(lead_id), "nome": nome, "email": email, "empresa": empresa}}


@tool
def obter_lead(ref: str) -> Dict[str, Any]:
    """Obtém um lead por referência (uuid/email/telefone/nome/empresa)."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            lead_id, matches = resolve_lead_id_by_ref(cur, ref)
            if lead_id:
                cur.execute(
                    "select id, nome, email, telefone, empresa, status_codigo, qualificado, score "
                    "from public.leads where id=%s",
                    (lead_id,),
                )
                r = cur.fetchone()
                if not r:
                    return {"error": {"message": "Lead não encontrado"}}
                return {"message": "Lead encontrado", "data": {
                    "lead_id": str(r[0]), "nome": r[1], "email": r[2], "telefone": r[3],
                    "empresa": r[4], "status_codigo": r[5], "qualificado": r[6], "score": r[7]}}
            if matches:
                return {"error": {"message": "Mais de um lead corresponde", "matches": matches}}
            return {"error": {"message": "Lead não encontrado"}}


@tool
def buscar_leads(consulta: str, limit: int = 20, offset: int = 0) -> Dict[str, Any]:
    """Procura leads por nome/empresa (LIKE), com paginação."""
    like = f"%{(consulta or '').lower()}%"
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "select id, nome, email, empresa from public.leads "
                "where lower(nome) like %s or lower(empresa) like %s "
                "order by criado_em desc limit %s offset %s",
                (like, like, limit, offset),
            )
            rows = cur.fetchall() or []
            cur.execute(
                "select count(*) from public.leads where lower(nome) like %s or lower(empresa) like %s",
                (like, like),
            )
            total = cur.fetchone()[0]
    items = [{"lead_id": r[0], "nome": r[1], "email": r[2], "empresa": r[3]} for r in rows]
    return {"message": f"{len(items)} resultados", "data": {"items": items, "total": total}}


@tool
def listar_leads(limit: int = 20, offset: int = 0, status_codigo: Optional[str] = None) -> Dict[str, Any]:
    """Lista leads recentes, opcionalmente filtrando por status_codigo."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            if status_codigo:
                cur.execute(
                    "select id, nome, email, empresa, status_codigo from public.leads "
                    "where status_codigo=%s order by criado_em desc limit %s offset %s",
                    (status_codigo, limit, offset),
                )
            else:
                cur.execute(
                    "select id, nome, email, empresa, status_codigo from public.leads "
                    "order by criado_em desc limit %s offset %s",
                    (limit, offset),
                )
            rows = cur.fetchall() or []
    items = [{"lead_id": r[0], "nome": r[1], "email": r[2], "empresa": r[3], "status_codigo": r[4]} for r in rows]
    return {"message": f"{len(items)} leads", "data": {"items": items}}


@tool
def atualizar_lead(
    lead_id: str,
    email: Optional[str] = None,
    telefone: Optional[str] = None,
    empresa: Optional[str] = None,
    status_codigo: Optional[str] = None,
) -> Dict[str, Any]:
    """Atualiza campos de um lead."""
    if not is_uuid(lead_id):
        return {"error": {"message": "lead_id inválido"}}
    sets, vals = [], []
    for col, val in (("email", email), ("telefone", telefone), ("empresa", empresa), ("status_codigo", status_codigo)):
        if val is not None:
            sets.append(f"{col}=%s")
            vals.append(val)
    if not sets:
        return {"error": {"message": "Nenhum campo para atualizar"}}
    sets.append("atualizado_em=now()")
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(f"update public.leads set {', '.join(sets)} where id=%s returning id", (*vals, lead_id))
            if not cur.fetchone():
                return {"error": {"message": "Lead não encontrado"}}
    return {"message": "Lead atualizado", "data": {"lead_id": lead_id}}


@tool
def qualificar_lead(
    lead_ref_ou_id: str,
    qualificado: bool = True,
    score: Optional[int] = None,
    etapa_funil: Optional[str] = None,
) -> Dict[str, Any]:
    """Qualifica um lead (marca qualificado, score 0-100 e/ou etapa do funil)."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            lead_id, matches = resolve_lead_id_by_ref(cur, lead_ref_ou_id)
            if not lead_id:
                if matches:
                    return {"error": {"message": "Mais de um lead corresponde", "matches": matches}}
                return {"error": {"message": "Lead não encontrado"}}
            sets, vals = ["qualificado=%s"], [qualificado]
            if score is not None:
                sets.append("score=%s"); vals.append(score)
            if etapa_funil is not None:
                sets.append("etapa_funil=%s"); vals.append(etapa_funil)
            sets.append("atualizado_em=now()")
            cur.execute(f"update public.leads set {', '.join(sets)} where id=%s", (*vals, lead_id))
    return {"message": "Lead qualificado", "data": {"lead_id": str(lead_id), "qualificado": qualificado, "score": score}}


@tool
def classificar_lead(lead_ref_ou_id: str, status_codigo: str) -> Dict[str, Any]:
    """Move o lead no funil (status_codigo: novo, em_contato, qualificado, proposta_enviada, fechado, perdido)."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("select 1 from public.status_lead where codigo=%s", (status_codigo,))
            if not cur.fetchone():
                return {"error": {"message": f"status_codigo inválido: {status_codigo}"}}
            lead_id, matches = resolve_lead_id_by_ref(cur, lead_ref_ou_id)
            if not lead_id:
                if matches:
                    return {"error": {"message": "Mais de um lead corresponde", "matches": matches}}
                return {"error": {"message": "Lead não encontrado"}}
            cur.execute("update public.leads set status_codigo=%s, atualizado_em=now() where id=%s", (status_codigo, lead_id))
    return {"message": "Lead classificado", "data": {"lead_id": str(lead_id), "status_codigo": status_codigo}}


# ═══════════════════════════ DÚVIDAS / RAG ═══════════════════════════
# Parâmetros padrão de recuperação (fallback). O threshold é aplicado à parte
# vetorial dentro de kb_hybrid_search; por isso "sem base" = lista vazia de chunks.
RAG_SEARCH_TYPE = "hybrid_rrf"
RAG_K = 5
RAG_MATCH_THRESHOLD = 0.35
RAG_CATEGORIA: Optional[str] = None
RAG_LLM_MODEL = os.getenv("RAG_LLM_MODEL", "gpt-4o-mini")


def _rag_recuperar_chunks(pergunta: str) -> List[Dict[str, Any]]:
    """Recupera chunks do KB do GMT via busca híbrida (RRF). Import lazy p/ evitar ciclo."""
    from app.rag.rag_tools import kb_search_gmt  # rag_tools importa get_conn deste módulo

    chunks = kb_search_gmt.invoke(
        {
            "query": pergunta,
            "k": RAG_K,
            "search_type": RAG_SEARCH_TYPE,
            "match_threshold": RAG_MATCH_THRESHOLD,
            "categoria": RAG_CATEGORIA,
            "reranker": "none",
            "use_hyde": False,
        }
    )
    return chunks or []


def _rag_compor_resposta(pergunta: str, chunks: List[Dict[str, Any]]) -> str:
    """Usa o LLM para formular a resposta ao lead a partir dos chunks (nunca inventa)."""
    from langchain_core.messages import HumanMessage, SystemMessage
    from langchain_openai import ChatOpenAI

    contexto = "\n\n".join(
        f"[Fonte: {c.get('doc_path')} #chunk {c.get('chunk_ix')}]\n{c.get('content')}"
        for c in chunks
    )
    system = (
        "Você é o agente de recepção da GMT (agência de automação, IA e marketing) na landing page.\n"
        "Responda à dúvida do visitante em português do Brasil, de forma clara, acolhedora e objetiva.\n"
        "Regras:\n"
        "- Baseie-se SOMENTE nos trechos do KB fornecidos; nunca invente serviços, prazos ou preços.\n"
        "- Reproduza os termos exatamente como no KB (nomes de serviços, entregáveis, etapas).\n"
        "- Para valores/preços exatos: não invente; explique o modelo e ofereça agendar uma reunião.\n"
        "- Ao final, ofereça um próximo passo (agendar reunião ou deixar contato)."
    )
    user = f"Pergunta do visitante:\n{pergunta}\n\nTrechos do KB:\n{contexto}"
    llm = ChatOpenAI(model=RAG_LLM_MODEL, temperature=0.2)
    resposta = llm.invoke([SystemMessage(content=system), HumanMessage(content=user)])
    return (resposta.content or "").strip()


@tool
def responder_duvida_rag(pergunta: str, lead_ref_ou_id: Optional[str] = None) -> Dict[str, Any]:
    """Responde uma dúvida do lead com base na base de conhecimento (RAG) e registra o histórico.

    Recupera contexto do KB do GMT (busca híbrida RRF, k=5, threshold=0.35) e formula a
    resposta ao lead em linguagem natural. Se nenhum chunk relevante for encontrado, NÃO
    inventa: registra a dúvida como não respondida e sinaliza escalonamento
    (`escalar=True`, `proxima_acao='duvida_escalar'`) para o agente chamar `escalar_duvida_humano`.
    """
    if not pergunta:
        return {"error": {"message": "pergunta é obrigatória"}}

    chunks = _rag_recuperar_chunks(pergunta)

    # Sem base suficiente (lista vazia / scores abaixo do threshold) → escalar, não inventar.
    if not chunks:
        with get_conn() as conn:
            with conn.cursor() as cur:
                lead_id = None
                if lead_ref_ou_id:
                    lead_id, _ = resolve_lead_id_by_ref(cur, lead_ref_ou_id)
                cur.execute(
                    "insert into public.duvidas (lead_id, pergunta, resposta, fonte, respondida_por_agente) "
                    "values (%s,%s,NULL,%s,false) returning id",
                    (lead_id, pergunta, "base_conhecimento_gmt"),
                )
                duvida_id = cur.fetchone()[0]
        return {
            "message": "Sem base suficiente no KB para responder com segurança",
            "data": {
                "duvida_id": duvida_id,
                "pergunta": pergunta,
                "resposta": None,
                "respondida": False,
                "escalar": True,
                "proxima_acao": "duvida_escalar",
            },
        }

    resposta = _rag_compor_resposta(pergunta, chunks)
    fontes = sorted({c.get("doc_path") for c in chunks if c.get("doc_path")})
    fonte = ", ".join(fontes) if fontes else "base_conhecimento_gmt"

    with get_conn() as conn:
        with conn.cursor() as cur:
            lead_id = None
            if lead_ref_ou_id:
                lead_id, _ = resolve_lead_id_by_ref(cur, lead_ref_ou_id)
            cur.execute(
                "insert into public.duvidas (lead_id, pergunta, resposta, fonte, respondida_por_agente) "
                "values (%s,%s,%s,%s,true) returning id",
                (lead_id, pergunta, resposta, fonte),
            )
            duvida_id = cur.fetchone()[0]
    return {
        "message": "Dúvida respondida",
        "data": {
            "duvida_id": duvida_id,
            "pergunta": pergunta,
            "resposta": resposta,
            "fonte": fonte,
            "fontes": fontes,
            "respondida": True,
            "escalar": False,
        },
    }


@tool
def escalar_duvida_humano(pergunta: str, motivo: str = "solicitação do lead", lead_ref_ou_id: Optional[str] = None) -> Dict[str, Any]:
    """Escala uma dúvida para atendimento humano e sinaliza notificação à equipe."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            lead_id = None
            if lead_ref_ou_id:
                lead_id, _ = resolve_lead_id_by_ref(cur, lead_ref_ou_id)
            cur.execute(
                "insert into public.duvidas (lead_id, pergunta, escalada, motivo_escalada, respondida_por_agente) "
                "values (%s,%s,true,%s,false) returning id",
                (lead_id, pergunta, motivo),
            )
            duvida_id = cur.fetchone()[0]
    return {"message": "Dúvida escalada", "data": {"duvida_id": duvida_id, "lead_id": lead_id, "motivo": motivo, "notificar_equipe": True}}


# ═══════════════════════════ ORÇAMENTOS ═══════════════════════════
@tool
def criar_orcamento(lead_ref_ou_id: str, titulo: str, moeda: str = "EUR") -> Dict[str, Any]:
    """Cria um orçamento em rascunho para um lead (moeda padrão EUR)."""
    if not titulo:
        return {"error": {"message": "Título é obrigatório"}}
    with get_conn() as conn:
        with conn.cursor() as cur:
            lead_id, matches = resolve_lead_id_by_ref(cur, lead_ref_ou_id)
            if not lead_id:
                if matches:
                    return {"error": {"message": "Mais de um lead corresponde", "matches": matches}}
                return {"error": {"message": "Lead não encontrado"}}
            cur.execute(
                "insert into public.orcamentos (lead_id, titulo, moeda) values (%s,%s,%s) returning id",
                (lead_id, titulo, moeda),
            )
            orcamento_id = cur.fetchone()[0]
    return {"message": "Orçamento criado", "data": {"orcamento_id": str(orcamento_id), "lead_id": str(lead_id), "titulo": titulo}}


def _recalc_orcamento(cur, orcamento_id: str) -> None:
    cur.execute("select coalesce(sum(total),0) from public.itens_orcamento where orcamento_id=%s", (orcamento_id,))
    subtotal = float(cur.fetchone()[0] or 0)
    cur.execute("select desconto_pct from public.orcamentos where id=%s", (orcamento_id,))
    row = cur.fetchone()
    desconto = float(row[0] or 0) if row else 0
    total = round(subtotal * (1 - desconto / 100.0), 2)
    cur.execute("update public.orcamentos set subtotal=%s, total=%s, atualizado_em=now() where id=%s",
                (subtotal, total, orcamento_id))


@tool
def adicionar_item_orcamento(orcamento_id: str, descricao: str, quantidade: float, preco_unitario: float) -> Dict[str, Any]:
    """Adiciona um item (serviço GMT) ao orçamento e recalcula totais."""
    if not is_uuid(orcamento_id):
        return {"error": {"message": "orcamento_id inválido"}}
    if not descricao or quantidade is None or preco_unitario is None:
        return {"error": {"message": "Campos obrigatórios: descricao, quantidade, preco_unitario"}}
    total_linha = round((quantidade or 0) * (preco_unitario or 0), 2)
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "insert into public.itens_orcamento (orcamento_id, descricao, quantidade, preco_unitario, total) "
                "values (%s,%s,%s,%s,%s) returning id",
                (orcamento_id, descricao, quantidade, preco_unitario, total_linha),
            )
            item_id = cur.fetchone()[0]
            _recalc_orcamento(cur, orcamento_id)
    return {"message": "Item adicionado", "data": {"orcamento_id": str(orcamento_id), "item_id": str(item_id)}}


@tool
def calcular_totais_orcamento(orcamento_id: str) -> Dict[str, Any]:
    """Recalcula e retorna os totais de um orçamento."""
    if not is_uuid(orcamento_id):
        return {"error": {"message": "orcamento_id inválido"}}
    with get_conn() as conn:
        with conn.cursor() as cur:
            _recalc_orcamento(cur, orcamento_id)
            cur.execute("select subtotal, desconto_pct, total from public.orcamentos where id=%s", (orcamento_id,))
            row = cur.fetchone()
            if not row:
                return {"error": {"message": "Orçamento não encontrado"}}
    return {"message": "Totais atualizados", "data": {
        "orcamento_id": orcamento_id, "subtotal": float(row[0]), "desconto_pct": float(row[1]), "total": float(row[2])}}


@tool
def atualizar_corpo_orcamento(orcamento_id: str, corpo_md: str) -> Dict[str, Any]:
    """Atualiza o corpo/escopo (Markdown) de um orçamento."""
    if not is_uuid(orcamento_id):
        return {"error": {"message": "orcamento_id inválido"}}
    if not (corpo_md or "").strip():
        return {"error": {"message": "corpo_md é obrigatório"}}
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("update public.orcamentos set corpo_md=%s, atualizado_em=now() where id=%s returning id",
                        (corpo_md, orcamento_id))
            if not cur.fetchone():
                return {"error": {"message": "Orçamento não encontrado"}}
    return {"message": "Corpo do orçamento atualizado", "data": {"orcamento_id": orcamento_id}}


@tool
def listar_orcamentos(lead_ref_ou_id: str) -> Dict[str, Any]:
    """Lista orçamentos de um lead."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            lead_id, matches = resolve_lead_id_by_ref(cur, lead_ref_ou_id)
            if not lead_id:
                if matches:
                    return {"error": {"message": "Mais de um lead corresponde", "matches": matches}}
                return {"error": {"message": "Lead não encontrado"}}
            cur.execute("select id, titulo, total, status_codigo from public.orcamentos where lead_id=%s order by criado_em desc",
                        (lead_id,))
            rows = cur.fetchall() or []
    items = [{"orcamento_id": r[0], "titulo": r[1], "total": float(r[2] or 0), "status": r[3]} for r in rows]
    return {"message": f"{len(items)} orçamentos", "data": {"items": items}}


@tool
def exportar_orcamento(orcamento_id: str, formato: str = "markdown") -> Dict[str, Any]:
    """Exporta um orçamento em markdown ou json."""
    if not is_uuid(orcamento_id):
        return {"error": {"message": "orcamento_id inválido"}}
    formato = (formato or "markdown").lower()
    if formato not in ("markdown", "json"):
        return {"error": {"message": "Formato inválido (use markdown|json)"}}
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "select o.id, o.titulo, o.moeda, o.subtotal, o.desconto_pct, o.total, o.corpo_md, l.nome, l.empresa "
                "from public.orcamentos o join public.leads l on l.id=o.lead_id where o.id=%s",
                (orcamento_id,),
            )
            head = cur.fetchone()
            if not head:
                return {"error": {"message": "Orçamento não encontrado"}}
            cur.execute("select descricao, quantidade, preco_unitario, total from public.itens_orcamento where orcamento_id=%s",
                        (orcamento_id,))
            itens = cur.fetchall() or []
    if formato == "json":
        return {"message": "Orçamento exportado", "data": {
            "orcamento_id": head[0], "titulo": head[1], "moeda": head[2],
            "subtotal": float(head[3] or 0), "desconto_pct": float(head[4] or 0), "total": float(head[5] or 0),
            "corpo_md": head[6], "lead": {"nome": head[7], "empresa": head[8]},
            "itens": [{"descricao": r[0], "quantidade": float(r[1] or 0), "preco_unitario": float(r[2] or 0), "total": float(r[3] or 0)} for r in itens]}}
    if head[6] and str(head[6]).strip():
        return {"message": "Orçamento exportado", "data": {"orcamento_id": orcamento_id, "formato": "markdown", "conteudo": str(head[6])}}
    linhas = [f"# {head[1]}", f"Cliente: {head[7]} ({head[8]})", "", "## Itens"]
    for r in itens:
        linhas.append(f"- {r[0]} — {r[1]} x {r[2]} = {r[3]}")
    linhas += ["", f"Subtotal: {head[3]}", f"Desconto: {head[4]}%", f"Total: {head[5]} {head[2]}"]
    return {"message": "Orçamento exportado", "data": {"orcamento_id": orcamento_id, "formato": "markdown", "conteudo": "\n".join(linhas)}}


# ═══════════════════════════ REUNIÕES ═══════════════════════════
@tool
def verificar_disponibilidade(
    data_referencia: Optional[str] = None, dias_a_frente: int = 7
) -> Dict[str, Any]:
    """Retorna horários livres com base nas regras de `public.disponibilidade_config`.

    Gera os slots a partir das janelas configuradas por dia da semana (ativo=true),
    respeitando a duração de cada slot, e remove os horários já ocupados na tabela
    `reunioes`. Integração com Google Calendar (push one-way) é P1 separado.
    """
    base = date.today()
    if data_referencia:
        try:
            base = datetime.fromisoformat(data_referencia).date()
        except Exception:
            pass

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "select dia_semana, hora_inicio, hora_fim, duracao_slot_min, fuso_horario "
                "from public.disponibilidade_config where ativo = true"
            )
            # dia_semana (0=seg..6=dom) casa 1:1 com Python date.weekday()
            janelas: Dict[int, List[Tuple[Any, Any, int, str]]] = {}
            for dow, hi, hf, dur, fuso in cur.fetchall() or []:
                janelas.setdefault(dow, []).append((hi, hf, int(dur), fuso or "Europe/Lisbon"))

            # Ocupados normalizados para UTC (reunioes.data_hora é timestamptz)
            cur.execute(
                "select data_hora from public.reunioes where status_codigo='agendada' and data_hora >= now()"
            )
            ocupados_utc = set()
            for (dh,) in cur.fetchall() or []:
                if dh.tzinfo is None:  # defensivo: assume UTC se vier naive
                    dh = dh.replace(tzinfo=timezone.utc)
                ocupados_utc.add(dh.astimezone(timezone.utc).replace(microsecond=0))

    agora_utc = datetime.now(timezone.utc)
    livres: List[str] = []
    for d in range(0, max(dias_a_frente, 0)):
        dia = base + timedelta(days=d)
        for hi, hf, dur, fuso in janelas.get(dia.weekday(), []):
            tz = ZoneInfo(fuso)  # localiza os slots no fuso da config (ex.: Europe/Lisbon)
            inicio = datetime.combine(dia, hi, tzinfo=tz)
            fim = datetime.combine(dia, hf, tzinfo=tz)
            passo = timedelta(minutes=dur)
            t = inicio
            while t + passo <= fim:
                t_utc = t.astimezone(timezone.utc).replace(microsecond=0)
                # compara em UTC: descarta passado e horários já ocupados
                if t_utc > agora_utc and t_utc not in ocupados_utc:
                    livres.append(t.isoformat())  # hora local (com offset) do fuso configurado
                t += passo

    livres.sort()
    return {"message": f"{len(livres)} horários disponíveis", "data": {"slots_disponiveis": livres}}


@tool
def agendar_reuniao(lead_ref_ou_id: str, data_hora: str, tipo: str = "online", local: Optional[str] = None) -> Dict[str, Any]:
    """Agenda uma reunião para um lead (tipo: online|presencial)."""
    if tipo not in ("online", "presencial"):
        return {"error": {"message": "tipo inválido (use online|presencial)"}}
    try:
        dt = datetime.fromisoformat(data_hora)
    except Exception:
        return {"error": {"message": "data_hora inválida (use ISO YYYY-MM-DDTHH:MM)"}}
    # tz-safe: aceita slot aware (com offset, vindo de verificar_disponibilidade) ou naive
    agora = datetime.now(dt.tzinfo) if dt.tzinfo else datetime.now()
    if dt < agora:
        return {"error": {"message": "Não é possível agendar em data passada."}}
    with get_conn() as conn:
        with conn.cursor() as cur:
            lead_id, matches = resolve_lead_id_by_ref(cur, lead_ref_ou_id)
            if not lead_id:
                if matches:
                    return {"error": {"message": "Mais de um lead corresponde", "matches": matches}}
                return {"error": {"message": "Lead não encontrado"}}
            cur.execute(
                "insert into public.reunioes (lead_id, data_hora, tipo, local) values (%s,%s,%s,%s) returning id",
                (lead_id, dt, tipo, local),
            )
            reuniao_id = cur.fetchone()[0]
            cur.execute("select nome, email, telefone from public.leads where id=%s", (lead_id,))
            lrow = cur.fetchone()
            lead_nome, lead_email, lead_telefone = (lrow[0], lrow[1], lrow[2]) if lrow else (None, None, None)
            # Duração do slot conforme disponibilidade_config (fallback 60 min)
            cur.execute(
                "select duracao_slot_min from public.disponibilidade_config "
                "where ativo=true and dia_semana=%s and hora_inicio <= %s and hora_fim > %s "
                "order by duracao_slot_min limit 1",
                (dt.weekday(), dt.time(), dt.time()),
            )
            drow = cur.fetchone()
            duracao_min = int(drow[0]) if drow else 60

    # Google Calendar (push one-way): a reunião JÁ está confirmada acima.
    # Qualquer falha do Google é logada e ignorada — nunca derruba o agendamento.
    gcal_event_id = None
    try:
        from app.core.gcal import criar_evento_gcal

        gcal_event_id = criar_evento_gcal(
            {
                "reuniao_id": reuniao_id,
                "lead_nome": lead_nome,
                "lead_email": lead_email,
                "data_hora": dt,
                "duracao_min": duracao_min,
                "tipo": tipo,
                "local": local,
                "timezone": "Europe/Lisbon",
            }
        )
        if gcal_event_id:
            with get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "update public.reunioes set gcal_event_id=%s, atualizado_em=now() where id=%s",
                        (gcal_event_id, reuniao_id),
                    )
    except Exception as e:  # noqa: BLE001 — Google é visualização, não fonte de verdade
        logger.warning("Falha ao criar evento no Google Calendar (reuniao %s): %s", reuniao_id, e)

    # E-mails de confirmação (lead + equipe): a reunião JÁ está confirmada acima.
    # Falha de envio é logada e ignorada — nunca derruba o agendamento.
    try:
        dt_local = (dt if dt.tzinfo else dt.replace(tzinfo=ZoneInfo("Europe/Lisbon"))).astimezone(
            ZoneInfo("Europe/Lisbon")
        )
        data_fmt = dt_local.strftime("%d/%m/%Y às %H:%M")
        linha_local = f"Local: {local}\n" if local else ""

        if lead_email:
            corpo_lead = (
                f"Olá {lead_nome or ''},\n\n"
                "Sua reunião com a GMT está confirmada.\n\n"
                f"Data e hora: {data_fmt} (Europe/Lisbon)\n"
                f"Tipo: {tipo}\n"
                f"{linha_local}\n"
                "Para cancelar ou reagendar, responda este e-mail."
            )
            enviar_email_confirmacao.func(
                lead_ref_ou_id=lead_id,
                tipo="confirmacao_reuniao",
                assunto=f"Reunião GMT confirmada — {data_fmt}",
                mensagem=corpo_lead,
                referencia_id=reuniao_id,
            )

        corpo_equipe = (
            "Nova reunião agendada.\n\n"
            f"Lead: {lead_nome or '(sem nome)'}\n"
            f"E-mail: {lead_email or '(sem e-mail)'}\n"
            f"Telefone: {lead_telefone or '(sem telefone)'}\n"
            f"Data e hora: {data_fmt} (Europe/Lisbon)\n"
            f"Tipo: {tipo}\n"
            f"{linha_local}"
            f"Reunião ID: {reuniao_id}"
        )
        notificar_equipe_email.func(
            tipo="alerta_equipe_reuniao",
            assunto=f"[GMT] Nova reunião agendada — {lead_nome or lead_id}",
            mensagem=corpo_equipe,
            referencia_id=reuniao_id,
            lead_ref_ou_id=lead_id,
        )
    except Exception as e:  # noqa: BLE001 — e-mail não é fonte de verdade do agendamento
        logger.warning("Falha ao enviar e-mails de confirmação (reuniao %s): %s", reuniao_id, e)

    return {"message": "Reunião agendada", "data": {
        "reuniao_id": str(reuniao_id), "lead_id": str(lead_id), "data_hora": dt.isoformat(),
        "tipo": tipo, "status": "agendada", "gcal_event_id": gcal_event_id}}


@tool
def remarcar_reuniao(reuniao_id: str, nova_data_hora: str) -> Dict[str, Any]:
    """Remarca uma reunião existente."""
    if not is_uuid(reuniao_id):
        return {"error": {"message": "reuniao_id inválido"}}
    try:
        dt = datetime.fromisoformat(nova_data_hora)
    except Exception:
        return {"error": {"message": "nova_data_hora inválida (use ISO)"}}
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "update public.reunioes set data_hora=%s, status_codigo='remarcada', "
                "lembrete_24h_enviado=false, lembrete_1h_enviado=false, atualizado_em=now() "
                "where id=%s returning lead_id",
                (dt, reuniao_id),
            )
            row = cur.fetchone()
            if not row:
                return {"error": {"message": "Reunião não encontrada"}}
    return {"message": "Reunião remarcada", "data": {"reuniao_id": str(reuniao_id), "nova_data_hora": dt.isoformat(), "lead_id": str(row[0])}}


@tool
def cancelar_reuniao(reuniao_id: str) -> Dict[str, Any]:
    """Cancela uma reunião."""
    if not is_uuid(reuniao_id):
        return {"error": {"message": "reuniao_id inválido"}}
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("update public.reunioes set status_codigo='cancelada', atualizado_em=now() where id=%s returning id",
                        (reuniao_id,))
            if not cur.fetchone():
                return {"error": {"message": "Reunião não encontrada"}}
    return {"message": "Reunião cancelada", "data": {"reuniao_id": reuniao_id, "status": "cancelada"}}


@tool
def listar_reunioes(lead_ref_ou_id: Optional[str] = None) -> Dict[str, Any]:
    """Lista reuniões (todas ou de um lead específico)."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            if lead_ref_ou_id:
                lead_id, matches = resolve_lead_id_by_ref(cur, lead_ref_ou_id)
                if not lead_id:
                    if matches:
                        return {"error": {"message": "Mais de um lead corresponde", "matches": matches}}
                    return {"error": {"message": "Lead não encontrado"}}
                cur.execute("select id, lead_id, data_hora, tipo, status_codigo from public.reunioes "
                            "where lead_id=%s order by data_hora", (lead_id,))
            else:
                cur.execute("select id, lead_id, data_hora, tipo, status_codigo from public.reunioes "
                            "where data_hora >= now() order by data_hora limit 50")
            rows = cur.fetchall() or []
    items = [{"reuniao_id": r[0], "lead_id": r[1], "data_hora": r[2].isoformat(), "tipo": r[3], "status": r[4]} for r in rows]
    return {"message": f"{len(items)} reuniões", "data": {"items": items}}


# ═══════════════════════════ NUTRIÇÃO ═══════════════════════════
@tool
def iniciar_sequencia_nutricao(lead_ref_ou_id: str, sequencia: str = "boas_vindas") -> Dict[str, Any]:
    """Inscreve o lead numa sequência de nutrição por e-mail."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            lead_id, matches = resolve_lead_id_by_ref(cur, lead_ref_ou_id)
            if not lead_id:
                if matches:
                    return {"error": {"message": "Mais de um lead corresponde", "matches": matches}}
                return {"error": {"message": "Lead não encontrado"}}
            cur.execute("select id, total_etapas from public.sequencias_nutricao where nome=%s and ativa=true", (sequencia,))
            seq = cur.fetchone()
            if not seq:
                return {"error": {"message": f"Sequência inválida: {sequencia}"}}
            cur.execute(
                "insert into public.nutricao_leads (lead_id, sequencia_id, etapa_atual, status, proximo_envio_em) "
                "values (%s,%s,1,'ativa', now()) "
                "on conflict (lead_id, sequencia_id) do update set status='ativa', atualizado_em=now() "
                "returning id",
                (lead_id, seq[0]),
            )
            insc_id = cur.fetchone()[0]
    return {"message": "Nutrição iniciada", "data": {"inscricao_id": insc_id, "lead_id": lead_id, "sequencia": sequencia, "etapa_atual": 1, "total_etapas": seq[1]}}


@tool
def pausar_sequencia_nutricao(lead_ref_ou_id: str, sequencia: str) -> Dict[str, Any]:
    """Pausa uma sequência de nutrição do lead."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            lead_id, _ = resolve_lead_id_by_ref(cur, lead_ref_ou_id)
            if not lead_id:
                return {"error": {"message": "Lead não encontrado"}}
            cur.execute(
                "update public.nutricao_leads nl set status='pausada', atualizado_em=now() "
                "from public.sequencias_nutricao s where nl.sequencia_id=s.id and nl.lead_id=%s and s.nome=%s returning nl.id",
                (lead_id, sequencia),
            )
            if not cur.fetchone():
                return {"error": {"message": "Inscrição não encontrada"}}
    return {"message": "Nutrição pausada", "data": {"lead_id": lead_id, "sequencia": sequencia, "status": "pausada"}}


@tool
def status_sequencia_nutricao(lead_ref_ou_id: str, sequencia: Optional[str] = None) -> Dict[str, Any]:
    """Retorna o status das sequências de nutrição do lead."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            lead_id, _ = resolve_lead_id_by_ref(cur, lead_ref_ou_id)
            if not lead_id:
                return {"error": {"message": "Lead não encontrado"}}
            q = ("select s.nome, nl.etapa_atual, s.total_etapas, nl.status from public.nutricao_leads nl "
                 "join public.sequencias_nutricao s on s.id=nl.sequencia_id where nl.lead_id=%s")
            params = [lead_id]
            if sequencia:
                q += " and s.nome=%s"; params.append(sequencia)
            cur.execute(q, tuple(params))
            rows = cur.fetchall() or []
    items = [{"sequencia": r[0], "etapa_atual": r[1], "total_etapas": r[2], "status": r[3]} for r in rows]
    return {"message": f"{len(items)} sequências", "data": {"items": items}}


# ═══════════════════════════ NOTIFICAÇÕES (E-MAIL) ═══════════════════════════
EMAIL_EQUIPE = os.getenv("GMT_EMAIL_EQUIPE", "contato@phellipeoliveira.org")


def _corpo_html(texto: str) -> str:
    """Envolve o texto simples em HTML mínimo (mantém quebras de linha)."""
    corpo = (texto or "").replace("\n", "<br>")
    return f'<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222">{corpo}</div>'


def _enviar_email_resend(
    destinatario: str, assunto: str, mensagem: str
) -> Tuple[bool, Optional[str], Optional[str]]:
    """Envia um e-mail via Resend.

    Retorna (enviado, erro_mensagem, provider_id). Nunca levanta exceção:
    erros da API (domínio não verificado, rate limit etc.) viram (False, msg, None).
    """
    api_key = os.getenv("RESEND_API_KEY")
    remetente = os.getenv("RESEND_FROM_EMAIL")
    if not api_key:
        return False, "RESEND_API_KEY não configurada", None
    if not remetente:
        return False, "RESEND_FROM_EMAIL não configurado", None
    try:
        import resend

        resend.api_key = api_key
        result = resend.Emails.send(
            {
                "from": remetente,
                "to": [destinatario],
                "subject": assunto,
                "html": _corpo_html(mensagem),
                "text": mensagem,
            }
        )
        provider_id = result.get("id") if isinstance(result, dict) else getattr(result, "id", None)
        return True, None, provider_id
    except Exception as e:  # noqa: BLE001 — falha de envio não deve quebrar o agente
        return False, str(e), None


def _registrar_notificacao(
    lead_id: Optional[str],
    tipo: str,
    destinatario: str,
    assunto: str,
    referencia_id: Optional[str],
    enviado: bool,
    erro: Optional[str],
) -> str:
    """Grava a notificação em public.notificacoes APÓS a tentativa de envio."""
    status = "enviado" if enviado else "erro"
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "insert into public.notificacoes "
                "(lead_id, tipo, destinatario, assunto, referencia_id, status_envio, erro_mensagem, enviado_em) "
                "values (%s,%s,%s,%s,%s,%s,%s, case when %s then now() else null end) returning id",
                (lead_id, tipo, destinatario, assunto, referencia_id, status, erro, enviado),
            )
            return cur.fetchone()[0]


@tool
def enviar_email_confirmacao(
    lead_ref_ou_id: str,
    tipo: str,
    assunto: str,
    mensagem: Optional[str] = None,
    referencia_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Envia e-mail de confirmação ao LEAD (via Resend) e registra em notificacoes.

    Use após cadastro ou agendamento. `mensagem` é o corpo; se omitido, usa o assunto.
    Grava o registro APÓS o envio, com status 'enviado' ou 'erro'.
    """
    with get_conn() as conn:
        with conn.cursor() as cur:
            lead_id, _ = resolve_lead_id_by_ref(cur, lead_ref_ou_id)
            if not lead_id:
                return {"error": {"message": "Lead não encontrado"}}
            cur.execute("select email from public.leads where id=%s", (lead_id,))
            row = cur.fetchone()
            destinatario = row[0] if row else None
    if not destinatario:
        return {"error": {"message": "Lead sem e-mail para confirmação"}}

    corpo = mensagem or assunto
    enviado, erro, _ = _enviar_email_resend(destinatario, assunto, corpo)
    notif_id = _registrar_notificacao(lead_id, tipo, destinatario, assunto, referencia_id, enviado, erro)
    return {
        "message": "E-mail de confirmação enviado" if enviado else "Falha ao enviar e-mail de confirmação",
        "data": {
            "notificacao_id": notif_id,
            "destinatario": destinatario,
            "tipo": tipo,
            "enviado": enviado,
            "erro": erro,
        },
    }


@tool
def notificar_equipe_email(
    tipo: str,
    assunto: str,
    mensagem: Optional[str] = None,
    referencia_id: Optional[str] = None,
    lead_ref_ou_id: Optional[str] = None,
) -> Dict[str, Any]:
    """Envia e-mail de alerta para a EQUIPE GMT (via Resend) e registra em notificacoes.

    Grava o registro APÓS o envio, com status 'enviado' ou 'erro'.
    """
    lead_id = None
    if lead_ref_ou_id:
        with get_conn() as conn:
            with conn.cursor() as cur:
                lead_id, _ = resolve_lead_id_by_ref(cur, lead_ref_ou_id)

    corpo = mensagem or assunto
    enviado, erro, _ = _enviar_email_resend(EMAIL_EQUIPE, assunto, corpo)
    notif_id = _registrar_notificacao(lead_id, tipo, EMAIL_EQUIPE, assunto, referencia_id, enviado, erro)
    return {
        "message": "Equipe notificada" if enviado else "Falha ao notificar equipe",
        "data": {
            "notificacao_id": notif_id,
            "destinatario": EMAIL_EQUIPE,
            "tipo": tipo,
            "enviado": enviado,
            "erro": erro,
        },
    }


# ═══════════════════════════ RELATÓRIO SEMANAL ═══════════════════════════
@tool
def gerar_relatorio_semanal(periodo_inicio: Optional[str] = None, periodo_fim: Optional[str] = None) -> Dict[str, Any]:
    """Consolida métricas da semana (leads, reuniões, orçamentos, dúvidas) e grava um relatório."""
    hoje = date.today()
    ini = datetime.fromisoformat(periodo_inicio).date() if periodo_inicio else hoje - timedelta(days=hoje.weekday() + 7)
    fim = datetime.fromisoformat(periodo_fim).date() if periodo_fim else ini + timedelta(days=6)
    with get_conn() as conn:
        with conn.cursor() as cur:
            def _count(sql, extra=()):
                cur.execute(sql, (ini, fim, *extra))
                return cur.fetchone()[0] or 0
            leads_novos = _count("select count(*) from public.leads where criado_em::date between %s and %s")
            leads_qual = _count("select count(*) from public.leads where qualificado=true and atualizado_em::date between %s and %s")
            reun_ag = _count("select count(*) from public.reunioes where criado_em::date between %s and %s")
            reun_conc = _count("select count(*) from public.reunioes where status_codigo='concluida' and atualizado_em::date between %s and %s")
            orc_criados = _count("select count(*) from public.orcamentos where criado_em::date between %s and %s")
            orc_aprov = _count("select count(*) from public.orcamentos where status_codigo='aprovado' and atualizado_em::date between %s and %s")
            duv_total = _count("select count(*) from public.duvidas where criado_em::date between %s and %s")
            duv_esc = _count("select count(*) from public.duvidas where escalada=true and criado_em::date between %s and %s")
            taxa = round((1 - (duv_esc / duv_total)) * 100, 2) if duv_total else 0
            cur.execute(
                """
                insert into public.relatorios
                (periodo_inicio, periodo_fim, leads_novos, leads_qualificados, reunioes_agendadas,
                 reunioes_concluidas, orcamentos_criados, orcamentos_aprovados, duvidas_total,
                 duvidas_escaladas, taxa_resolucao)
                values (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s) returning id
                """,
                (ini, fim, leads_novos, leads_qual, reun_ag, reun_conc, orc_criados, orc_aprov, duv_total, duv_esc, taxa),
            )
            relatorio_id = cur.fetchone()[0]
    metricas = {"leads_novos": leads_novos, "leads_qualificados": leads_qual, "reunioes_agendadas": reun_ag,
                "reunioes_concluidas": reun_conc, "orcamentos_criados": orc_criados, "orcamentos_aprovados": orc_aprov,
                "duvidas_total": duv_total, "duvidas_escaladas": duv_esc, "taxa_resolucao": taxa}
    return {"message": "Relatório gerado", "data": {"relatorio_id": relatorio_id, "periodo": f"{ini} a {fim}", "metricas": metricas}}


# ═══════════════════════════ UTILIDADES ═══════════════════════════
@tool
def listar_status_lead() -> Dict[str, Any]:
    """Lista os status válidos do funil de leads (lookup)."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("select codigo, rotulo from public.status_lead order by ordem, codigo")
            rows = cur.fetchall() or []
    items = [{"codigo": r[0], "rotulo": r[1]} for r in rows]
    return {"message": f"{len(items)} status", "data": {"items": items, "total": len(items)}}


@tool
def resolver_lead(ref: str) -> Dict[str, Any]:
    """Resolve um lead por referência (uuid/email/telefone/nome/empresa)."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            lead_id, matches = resolve_lead_id_by_ref(cur, ref)
            if lead_id:
                return {"message": "Lead resolvido", "data": {"lead_id": str(lead_id)}}
            if matches:
                return {"error": {"message": "Mais de um lead corresponde", "matches": matches}}
            return {"error": {"message": "Lead não encontrado"}}


@tool
def respond_message(mensagem: str, intent: str, dados: Optional[dict] = None) -> Dict[str, Any]:
    """Padroniza a saída do agente: mensagem, intent e dados opcionais."""
    return {"message": mensagem, "intent": intent, "data": dados or {}}
