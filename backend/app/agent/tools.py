"""
Ferramentas (tools) do Agente GMT — Fase 1 (Receção Digital)

Grupos ativos:
- Leads: cadastrar, obter, buscar, listar, atualizar, resolver
- Dúvidas / RAG: responder_duvida_rag
- Reuniões: verificar disponibilidade, agendar, remarcar, cancelar, listar
- Notificações: e-mail confirmação (lead) e alerta (equipe) via Resend

Fase 2 (Agente Comercial — projeto separado, integração via webhook):
- Orçamentos, Nutrição, Relatórios, Escalada humana
- Referência: ver docs/FASE2_AGENTE_COMERCIAL.md
"""

import base64
import hashlib
import hmac
import json
import logging
import os
import re
from datetime import datetime, date, time, timedelta, timezone
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
EMAIL_RE = re.compile(r"^[^@\s]+@[^@\s]+\.[^@\s]+$")
CAL_COM_LINK = os.getenv("CAL_COM_LINK", "https://cal.com/phellipe-oliveira-ncbgsl/30min")


def normalize_phone(s: str) -> str:
    return re.sub(r"\D+", "", s or "")


def _nome_fallback_from_email(email: str) -> str:
    """Nome temporário a partir da parte local do e-mail (ex.: social.data → Social Data)."""
    local = (email or "").split("@", 1)[0].strip()
    if not local:
        return ""
    formatted = re.sub(r"[._]+", " ", local).strip()
    return formatted.title() if formatted else ""


def is_uuid(s: str) -> bool:
    return bool(s) and bool(UUID_RE.match(s))


def _is_email(s: Optional[str]) -> bool:
    return bool(s and EMAIL_RE.match((s or "").strip()))


def _action_token_secret() -> str:
    """Segredo HMAC para links de gestão de reunião via e-mail."""
    secret = (
        os.getenv("MEETING_ACTION_TOKEN_SECRET")
        or os.getenv("ADMIN_API_TOKEN")
        or ""
    )
    if not secret:
        raise RuntimeError("MEETING_ACTION_TOKEN_SECRET (ou ADMIN_API_TOKEN) não configurado")
    return secret


def _b64url_encode(raw: bytes) -> str:
    return base64.urlsafe_b64encode(raw).decode("ascii").rstrip("=")


def _b64url_decode(data: str) -> bytes:
    pad = "=" * (-len(data) % 4)
    return base64.urlsafe_b64decode(data + pad)


def _sign_payload_b64(payload_b64: str) -> str:
    return hmac.new(
        _action_token_secret().encode("utf-8"),
        payload_b64.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def gerar_token_acao_reuniao(reuniao_id: str, email: str, acao: str, ttl_sec: int = 172800) -> str:
    """Gera token assinado para ações de reunião (cancelar/reagendar)."""
    payload = {
        "rid": str(reuniao_id),
        "email": (email or "").strip().lower(),
        "act": acao,
        "exp": int(datetime.now(timezone.utc).timestamp()) + max(int(ttl_sec), 60),
    }
    payload_b64 = _b64url_encode(json.dumps(payload, separators=(",", ":")).encode("utf-8"))
    sig = _sign_payload_b64(payload_b64)
    return f"{payload_b64}.{sig}"


def validar_token_acao_reuniao(token: str, acao_esperada: str) -> Dict[str, Any]:
    """Valida token assinado e retorna payload com rid/email/act/exp."""
    if not token or "." not in token:
        raise ValueError("Token inválido")
    payload_b64, sig = token.split(".", 1)
    expected = _sign_payload_b64(payload_b64)
    if not hmac.compare_digest(sig, expected):
        raise ValueError("Assinatura inválida")
    payload = json.loads(_b64url_decode(payload_b64).decode("utf-8"))
    if payload.get("act") != acao_esperada:
        raise ValueError("Ação inválida para este token")
    exp = int(payload.get("exp") or 0)
    if exp <= int(datetime.now(timezone.utc).timestamp()):
        raise ValueError("Link expirado")
    rid = str(payload.get("rid") or "")
    email = str(payload.get("email") or "").strip().lower()
    if not is_uuid(rid) or not _is_email(email):
        raise ValueError("Payload inválido")
    return {"rid": rid, "email": email, "act": payload.get("act"), "exp": exp}


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
    # Preferência por correspondência EXATA de nome/empresa (evita reaproveitar um
    # lead homônimo por substring). Só cai no LIKE único quando não há exato.
    ref_lower = ref.lower()
    exatos = [r for r in rows if (r[1] or "").lower() == ref_lower or (r[3] or "").lower() == ref_lower]
    if len(exatos) == 1:
        return exatos[0][0], []
    if not exatos and len(rows) == 1:
        return rows[0][0], []
    base = exatos or rows
    return None, [{"lead_id": r[0], "nome": r[1], "email": r[2], "empresa": r[3]} for r in base]


def upsert_lead_identidade(
    cur,
    nome: Optional[str] = None,
    email: Optional[str] = None,
    telefone: Optional[str] = None,
    empresa: Optional[str] = None,
    origem: str = "chat_site",
    consentimento_lgpd: bool = False,
) -> Tuple[Optional[str], bool]:
    """Resolve/persiste a IDENTIDADE do lead priorizando o E-MAIL como fonte de verdade.

    Ordem de resolução: e-mail -> telefone. NUNCA casa por nome — assim evitamos
    reaproveitar um lead antigo homônimo (com e-mail desatualizado). Se encontrar,
    atualiza os campos informados; se não existir, cria (exige nome + email/telefone).

    Retorna (lead_id_str_ou_none, criado_bool). Usa o cursor recebido (mesma transação).
    """
    existente_id = None
    if email:
        cur.execute("select id from public.leads where lower(email)=lower(%s)", (email,))
        row = cur.fetchone()
        existente_id = row[0] if row else None
    if not existente_id and telefone:
        cur.execute(
            "select id from public.leads where regexp_replace(telefone,'[^0-9]','','g')=%s",
            (normalize_phone(telefone),),
        )
        row = cur.fetchone()
        existente_id = row[0] if row else None

    if existente_id:
        sets, vals = ["atualizado_em=now()"], []
        for col, val in (("nome", nome), ("email", email), ("telefone", telefone), ("empresa", empresa)):
            if val:
                sets.append(f"{col}=%s")
                vals.append(val)
        cur.execute(f"update public.leads set {', '.join(sets)} where id=%s", (*vals, existente_id))
        return str(existente_id), False

    if not (email or telefone) or not nome:
        return None, False

    cur.execute(
        "insert into public.leads (nome, email, telefone, empresa, origem, consentimento_lgpd) "
        "values (%s,%s,%s,%s,%s,%s) returning id",
        (nome, email, telefone, empresa, origem, consentimento_lgpd),
    )
    return str(cur.fetchone()[0]), True


# ═══════════════════════════ LEADS ═══════════════════════════
@tool
def cadastrar_lead(
    nome: Optional[str] = None,
    email: Optional[str] = None,
    telefone: Optional[str] = None,
    empresa: Optional[str] = None,
    origem: str = "chat_site",
    consentimento_lgpd: bool = False,
) -> Dict[str, Any]:
    """Cadastra um lead. Exige pelo menos email OU telefone (nome opcional).

    Se nome não for informado e houver e-mail, usa a parte local do e-mail como
    nome temporário (ex.: besolutionmindset@gmail.com → Besolutionmindset;
    social.data@… → Social Data). Pode ser sobrescrito depois via atualizar_lead.

    Idempotente: se já existe um lead com o mesmo e-mail (ou telefone), ATUALIZA os
    campos informados em vez de duplicar — o e-mail é a identidade do lead.
    """
    email_eff = (email or "").strip() or None
    telefone_eff = (telefone or "").strip() or None
    if not (email_eff or telefone_eff):
        return {"error": {"message": "Informe pelo menos email ou telefone para cadastrar."}}
    nome_eff = (nome or "").strip() or None
    if not nome_eff and email_eff:
        nome_eff = _nome_fallback_from_email(email_eff) or None
    with get_conn() as conn:
        with conn.cursor() as cur:
            lead_id, criado = upsert_lead_identidade(
                cur, nome=nome_eff, email=email_eff, telefone=telefone_eff, empresa=empresa,
                origem=origem, consentimento_lgpd=consentimento_lgpd,
            )
    # psycopg devolve colunas uuid como objetos uuid.UUID; upsert_lead_identidade já
    # converte para str para garantir que o retorno seja JSON-serializável (o ToolNode
    # do subgrafo ReAct serializa o dict via json.dumps).
    if not lead_id:
        return {"error": {"message": "Não foi possível cadastrar o lead."}}
    return {
        "message": "Lead cadastrado" if criado else "Lead já existente — dados atualizados",
        "data": {"lead_id": lead_id, "nome": nome_eff, "email": email_eff,
                 "empresa": empresa, "atualizado": not criado},
    }


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


# ═══════════════════════════ DÚVIDAS / RAG ═══════════════════════════
# Parâmetros padrão de recuperação (fallback). O threshold é aplicado à parte
# vetorial dentro de rag_hybrid_search; por isso "sem base" = lista vazia de chunks.
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
        "Chamas-te Ara. És o assistente digital da GMT (Growth Marketing Technology), "
        "uma agência portuguesa de IA, marketing digital e desenvolvimento web.\n"
        "Respondes à dúvida do visitante em português de Portugal (PT-PT), "
        "de forma clara, directa e calorosa.\n"
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
    inventa: registra a dúvida como não respondida e orienta encaminhamento pela equipe
    comercial no fluxo conversacional.
    """
    if not pergunta:
        return {"error": {"message": "pergunta é obrigatória"}}

    chunks = _rag_recuperar_chunks(pergunta)

    # Sem base suficiente (lista vazia / scores abaixo do threshold) -> nao inventar.
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
            # Complementa os ocupados com eventos reais do Google Calendar (blocos externos ao Supabase)
            try:
                from app.core.gcal import listar_slots_ocupados_gcal
                from zoneinfo import ZoneInfo as _ZI
                _tz = _ZI("Europe/Lisbon")
                _inicio_range = datetime.combine(base, time(0, 0), tzinfo=_tz)
                _fim_range = datetime.combine(
                    base + timedelta(days=max(dias_a_frente, 1)),
                    time(23, 59, 59),
                    tzinfo=_tz,
                )
                gcal_ocupados = listar_slots_ocupados_gcal(
                    _inicio_range.isoformat(),
                    _fim_range.isoformat(),
                )
                ocupados_utc.update(gcal_ocupados)
            except Exception as _e:
                logger.warning("Não foi possível complementar com Google Calendar: %s", _e)

    agora_utc = datetime.now(timezone.utc)
    livres: List[str] = []
    for d in range(0, max(dias_a_frente, 0)):
        dia = base + timedelta(days=d)
        for hi, hf, dur, fuso in janelas.get(dia.weekday(), []):
            tz = ZoneInfo(fuso or "Europe/Lisbon")  # localiza os slots no fuso da config (ex.: Europe/Lisbon)
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
def sugerir_horarios_proximo_dia_util(
    data_referencia: Optional[str] = None,
    max_dias: int = 14,
) -> Dict[str, Any]:
    """Sugere horários livres no primeiro dia seguinte com disponibilidade ativa na config."""
    base = date.today()
    if data_referencia:
        try:
            base = datetime.fromisoformat(data_referencia).date()
        except Exception:
            pass

    nomes_dia = {
        0: "segunda-feira",
        1: "terça-feira",
        2: "quarta-feira",
        3: "quinta-feira",
        4: "sexta-feira",
        5: "sábado",
        6: "domingo",
    }

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                """
                select
                    'janela' as tipo,
                    dia_semana,
                    hora_inicio,
                    hora_fim,
                    duracao_slot_min,
                    fuso_horario,
                    null::timestamptz as data_hora
                from public.disponibilidade_config
                where ativo = true
                union all
                select
                    'ocupado' as tipo,
                    null::int,
                    null::time,
                    null::time,
                    null::int,
                    null::text,
                    data_hora
                from public.reunioes
                where status_codigo = 'agendada'
                  and data_hora >= now()
                """
            )
            rows = cur.fetchall() or []

    janelas: Dict[int, List[Tuple[Any, Any, int, str]]] = {}
    ocupados_utc = set()
    for tipo, dow, hi, hf, dur, fuso, dh in rows:
        if tipo == "janela":
            if dow is not None and hi is not None and hf is not None and dur is not None:
                janelas.setdefault(int(dow), []).append((hi, hf, int(dur), fuso or "Europe/Lisbon"))
            continue
        if dh is None:
            continue
        if dh.tzinfo is None:
            dh = dh.replace(tzinfo=timezone.utc)
        ocupados_utc.add(dh.astimezone(timezone.utc).replace(microsecond=0))

    agora_utc = datetime.now(timezone.utc)
    limite = max(max_dias, 0)
    for offset in range(1, limite + 1):
        dia = base + timedelta(days=offset)
        janelas_dia = janelas.get(dia.weekday(), [])
        if not janelas_dia:
            continue

        livres: List[str] = []
        for hi, hf, dur, fuso in janelas_dia:
            tz = ZoneInfo(fuso or "Europe/Lisbon")
            inicio = datetime.combine(dia, hi, tzinfo=tz)
            fim = datetime.combine(dia, hf, tzinfo=tz)
            passo = timedelta(minutes=int(dur))
            t = inicio
            while t + passo <= fim:
                t_utc = t.astimezone(timezone.utc).replace(microsecond=0)
                if t_utc > agora_utc and t_utc not in ocupados_utc:
                    livres.append(t.isoformat())
                t += passo

        livres.sort()
        if livres:
            nome_dia = nomes_dia.get(dia.weekday(), "dia")
            return {
                "message": f"{len(livres)} horários disponíveis em {nome_dia} ({dia.strftime('%d/%m/%Y')})",
                "data": {
                    "dia": dia.isoformat(),
                    "nome_dia": nome_dia,
                    "slots_disponiveis": livres,
                },
            }

    return {
        "message": f"Nenhum horário disponível nos próximos {limite} dias",
        "data": {"slots_disponiveis": []},
    }


@tool
def agendar_reuniao(
    lead_ref_ou_id: str,
    data_hora: str,
    email: Optional[str] = None,
    nome: Optional[str] = None,
    telefone: Optional[str] = None,
) -> Dict[str, Any]:
    """Agenda uma reunião online para um lead.

    IDENTIDADE POR E-MAIL: se `email` for informado, ele é a fonte de verdade — o lead
    é resolvido/criado por esse e-mail (corrigindo nome/telefone), e a confirmação vai
    exatamente para esse endereço. Sem `email`, resolve pelo `lead_ref_ou_id`.
    Passe `email`/`nome` sempre que o visitante os fornecer, para não reaproveitar um
    e-mail antigo de um lead homônimo.
    """
    tipo = "online"
    local = None
    # Nome opcional: usa parte local do email como fallback
    if not (nome or "").strip() and email:
        local = email.split("@")[0]
        nome = re.sub(r"[._\-]+", " ", local).strip().title() or "Visitante"
    try:
        dt = datetime.fromisoformat(data_hora)
    except Exception:
        return {"error": {"message": "data_hora inválida (use ISO YYYY-MM-DDTHH:MM)"}}
    # Fonte de verdade de fuso: se vier naive, assume Europe/Lisbon.
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=ZoneInfo("Europe/Lisbon"))
    # tz-safe: aceita slot aware (com offset, vindo de verificar_disponibilidade) ou naive
    agora = datetime.now(dt.tzinfo) if dt.tzinfo else datetime.now()
    if dt < agora:
        return {"error": {"message": "Não é possível agendar em data passada."}}
    if dt.weekday() in (5, 6):
        return {
            "error": {
                "message": "Reuniões não disponíveis ao fim de semana. Use sugerir_horarios_proximo_dia_util para obter o próximo dia útil disponível."
            }
        }
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "select 1 from public.disponibilidade_config "
                "where ativo=true and dia_semana=%s and hora_inicio <= %s and hora_fim > %s "
                "limit 1",
                (dt.weekday(), dt.time(), dt.time()),
            )
            if not cur.fetchone():
                return {
                    "error": {
                        "message": "Horário fora da janela de disponibilidade configurada. Use verificar_disponibilidade ou sugerir_horarios_proximo_dia_util."
                    }
                }
    with get_conn() as conn:
        with conn.cursor() as cur:
            lead_id = None
            # E-mail informado → resolve/cria por e-mail (fonte de verdade da identidade).
            if email or telefone:
                nome_eff = nome
                if not nome_eff and lead_ref_ou_id and not is_uuid(lead_ref_ou_id) \
                        and "@" not in lead_ref_ou_id and len(normalize_phone(lead_ref_ou_id)) < 8:
                    nome_eff = lead_ref_ou_id
                lead_id, _ = upsert_lead_identidade(
                    cur, nome=nome_eff, email=email, telefone=telefone,
                )
            if not lead_id:
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
    meet_link = None
    try:
        from app.core.gcal import criar_evento_gcal

        gcal_result = criar_evento_gcal(
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
        gcal_event_id = gcal_result.get("gcal_event_id") if isinstance(gcal_result, dict) else None
        meet_link = gcal_result.get("meet_link") if isinstance(gcal_result, dict) else None
        if gcal_event_id:
            with get_conn() as conn:
                with conn.cursor() as cur:
                    cur.execute(
                        "update public.reunioes set gcal_event_id=%s, atualizado_em=now() where id=%s",
                        (gcal_event_id, reuniao_id),
                    )
    except Exception as e:  # noqa: BLE001 — Google é visualização, não fonte de verdade
        logger.warning(
            "Falha ao criar evento no Google Calendar (reuniao %s): %s", reuniao_id, e,
            exc_info=True,
        )

    # E-mails de confirmação (lead + equipe): a reunião JÁ está confirmada acima.
    # Falha de envio é logada e ignorada — nunca derruba o agendamento.
    try:
        dt_local = (dt if dt.tzinfo else dt.replace(tzinfo=ZoneInfo("Europe/Lisbon"))).astimezone(
            ZoneInfo("Europe/Lisbon")
        )
        data_fmt = dt_local.strftime("%d/%m/%Y às %H:%M")
        plataforma = "Google Meet"
        if lead_email:
            corpo_lead = (
                f"Olá {lead_nome or ''},\n\n"
                "A sua reunião com os especialistas da GMT (Growth Marketing Technology) está confirmada. "
                "Obrigado pelo seu interesse!\n\n"
                "DETALHES DA REUNIÃO\n"
                f"• Data e hora: {data_fmt} (hora de Lisboa / Europe/Lisbon)\n"
                f"• Duração: até {duracao_min} minutos\n"
                "• Formato: Online\n"
                "• Plataforma: Google Meet\n"
                "• Link da reunião: Será enviado por e-mail até 24h antes da reunião.\n"
                "\n"
                "O QUE ESPERAR\n"
                "Vamos perceber a sua necessidade e propor o próximo passo, de forma objetiva. "
                "Se quiser, traga as suas principais dúvidas e o objetivo do seu projeto.\n\n"
                "O convite de calendário (.ics) segue em anexo — basta abri-lo para adicionar à sua agenda.\n"
                "Para remarcar ou cancelar, basta responder a este e-mail.\n\n"
                "Até breve,\n"
                "Equipa GMT"
            )
            ics = _build_ics_reuniao(
                reuniao_id=str(reuniao_id),
                nome=lead_nome,
                email=lead_email,
                inicio=dt,
                duracao_min=duracao_min,
                tipo=tipo,
                local=local,
            )
            _enviar_e_registrar(
                lead_id=lead_id,
                tipo="confirmacao_reuniao",
                destinatario=lead_email,
                assunto=f"Reunião GMT confirmada — {data_fmt}",
                corpo=corpo_lead,
                referencia_id=reuniao_id,
                attachments=[ics],
                html_override=_build_html_confirmacao_reuniao(
                    lead_nome=lead_nome or "",
                    data_fmt=data_fmt,
                    duracao_min=duracao_min,
                    meet_link=meet_link,
                ),
            )

        gcal_txt = f"Google Calendar: evento {gcal_event_id}\n" if gcal_event_id else ""
        corpo_equipe = (
            "Nova reunião agendada pelo agente do site.\n\n"
            "LEAD\n"
            f"• Nome: {lead_nome or '(sem nome)'}\n"
            f"• E-mail: {lead_email or '(sem e-mail)'}\n"
            f"• Telefone: {lead_telefone or '(sem telefone)'}\n\n"
            "REUNIÃO\n"
            f"• Data e hora: {data_fmt} (hora de Lisboa / Europe/Lisbon)\n"
            f"• Duração: até {duracao_min} min\n"
            f"• Formato: Online ({plataforma})\n"
            f"• Reunião ID: {reuniao_id}\n"
            f"• Lead ID: {lead_id}\n"
            f"{gcal_txt}\n"
            "Próximo passo sugerido: preparar o contacto comercial e confirmar a agenda."
        )
        notificar_equipe_email.func(
            tipo="alerta_equipe_reuniao",
            assunto=f"[GMT] Nova reunião agendada — {lead_nome or lead_id}",
            mensagem=corpo_equipe,
            referencia_id=reuniao_id,
            lead_ref_ou_id=lead_id,
        )
    except Exception as e:  # noqa: BLE001 — e-mail não é fonte de verdade do agendamento
        logger.warning(
            "Falha ao enviar e-mails de confirmação (reuniao %s): %s", reuniao_id, e,
            exc_info=True,
        )

    return {"message": "Reunião agendada", "data": {
        "reuniao_id": str(reuniao_id), "lead_id": str(lead_id), "data_hora": dt.isoformat(),
        "tipo": tipo, "status": "agendada", "gcal_event_id": gcal_event_id, "meet_link": meet_link}}


@tool
def remarcar_reuniao(reuniao_id: str, nova_data_hora: str) -> Dict[str, Any]:
    """Remarca uma reunião: actualiza Supabase, actualiza Google Calendar e envia e-mail ao lead."""
    if not is_uuid(reuniao_id):
        return {"error": {"message": "reuniao_id inválido"}}
    try:
        dt = datetime.fromisoformat(nova_data_hora)
    except Exception:
        return {"error": {"message": "nova_data_hora inválida (use ISO)"}}
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=ZoneInfo("Europe/Lisbon"))

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute("select data_hora from public.reunioes where id=%s", (reuniao_id,))
            antiga = cur.fetchone()
            if not antiga:
                return {"error": {"message": "Reunião não encontrada"}}
            dt_antiga = antiga[0]
            if dt_antiga and dt_antiga.tzinfo is None:
                dt_antiga = dt_antiga.replace(tzinfo=ZoneInfo("Europe/Lisbon"))
            data_fmt_antiga = (
                dt_antiga.astimezone(ZoneInfo("Europe/Lisbon")).strftime("%d/%m/%Y às %H:%M")
                if dt_antiga
                else "desconhecida"
            )
            cur.execute(
                "update public.reunioes set data_hora=%s, status_codigo='remarcada', "
                "lembrete_24h_enviado=false, lembrete_1h_enviado=false, atualizado_em=now() "
                "where id=%s returning lead_id, gcal_event_id, "
                "(select duracao_slot_min from public.disponibilidade_config "
                " where ativo=true and dia_semana=%s and hora_inicio <= %s and hora_fim > %s "
                " order by duracao_slot_min limit 1)",
                (dt, reuniao_id, dt.weekday(), dt.time(), dt.time()),
            )
            row = cur.fetchone()
            if not row:
                return {"error": {"message": "Reunião não encontrada"}}
            lead_id, gcal_event_id, duracao_min = row[0], row[1], int(row[2] or 60)
            cur.execute("select nome, email from public.leads where id=%s", (lead_id,))
            lrow = cur.fetchone()
            lead_nome = lrow[0] if lrow else None
            lead_email = lrow[1] if lrow else None

    # Google Calendar — actualiza data/hora do evento (best-effort)
    if gcal_event_id:
        try:
            from app.core.gcal import atualizar_evento_gcal
            atualizar_evento_gcal(gcal_event_id, dt, duracao_min=duracao_min)
        except Exception as e:
            logger.warning("Falha ao actualizar evento GCal (reuniao %s): %s", reuniao_id, e)

    # E-mail ao lead (best-effort)
    try:
        dt_local = dt.astimezone(ZoneInfo("Europe/Lisbon"))
        data_fmt = dt_local.strftime("%d/%m/%Y às %H:%M")
        if lead_email:
            assunto = f"Reunião GMT remarcada — {data_fmt}"
            corpo = (
                f"Olá {lead_nome or ''},\n\n"
                f"A sua reunião foi remarcada para {data_fmt} (hora de Lisboa).\n\n"
                f"Duração prevista: até {duracao_min} minutos | Formato: Online\n\n"
                "O convite de calendário actualizado será enviado em breve.\n"
                "Para cancelar ou alterar novamente, escreva no chat do nosso website.\n\n"
                "Até breve,\nEquipa GMT"
            )
            _enviar_e_registrar(
                lead_id=str(lead_id),
                tipo="atualizacao_reuniao",
                destinatario=lead_email,
                assunto=assunto,
                corpo=corpo,
                referencia_id=reuniao_id,
                html_override=_build_html_remarcacao_reuniao(
                    lead_nome=lead_nome or "",
                    data_fmt_antiga=data_fmt_antiga,
                    data_fmt_nova=data_fmt,
                    duracao_min=duracao_min,
                ),
            )
        notificar_equipe_email.func(
            tipo="alerta_equipe_reuniao",
            assunto=f"[GMT] Reunião remarcada — {lead_nome or lead_id}",
            mensagem=(
                f"Reunião remarcada pelo agente.\n"
                f"Lead: {lead_nome or '(sem nome)'} | {lead_email or '(sem e-mail)'}\n"
                f"Nova data/hora: {data_fmt}\n"
                f"Reunião ID: {reuniao_id}"
            ),
            referencia_id=reuniao_id,
            lead_ref_ou_id=str(lead_id),
        )
    except Exception as e:
        logger.warning("Falha ao enviar e-mails de remarcação (reuniao %s): %s", reuniao_id, e)

    return {
        "message": "Reunião remarcada",
        "data": {
            "reuniao_id": str(reuniao_id),
            "nova_data_hora": dt.isoformat(),
            "lead_id": str(lead_id),
        },
    }


@tool
def cancelar_reuniao(reuniao_id: str) -> Dict[str, Any]:
    """Cancela uma reunião: actualiza Supabase, remove do Google Calendar e envia e-mail ao lead."""
    if not is_uuid(reuniao_id):
        return {"error": {"message": "reuniao_id inválido"}}

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "update public.reunioes set status_codigo='cancelada', atualizado_em=now() "
                "where id=%s returning lead_id, data_hora, gcal_event_id",
                (reuniao_id,),
            )
            row = cur.fetchone()
            if not row:
                return {"error": {"message": "Reunião não encontrada"}}
            lead_id, data_hora, gcal_event_id = row[0], row[1], row[2]
            cur.execute("select nome, email from public.leads where id=%s", (lead_id,))
            lrow = cur.fetchone()
            lead_nome = lrow[0] if lrow else None
            lead_email = lrow[1] if lrow else None

    # Google Calendar — remove o evento (best-effort, nunca bloqueia)
    if gcal_event_id:
        try:
            from app.core.gcal import cancelar_evento_gcal
            cancelar_evento_gcal(gcal_event_id)
        except Exception as e:
            logger.warning("Falha ao cancelar evento GCal (reuniao %s): %s", reuniao_id, e)

    # E-mail ao lead (best-effort)
    try:
        if lead_email and data_hora:
            if data_hora.tzinfo is None:
                data_hora = data_hora.replace(tzinfo=ZoneInfo("Europe/Lisbon"))
            dt_local = data_hora.astimezone(ZoneInfo("Europe/Lisbon"))
            data_fmt = dt_local.strftime("%d/%m/%Y às %H:%M")
            assunto = f"Reunião GMT cancelada — {data_fmt}"
            corpo = (
                f"Olá {lead_nome or ''},\n\n"
                f"A sua reunião agendada para {data_fmt} (hora de Lisboa) foi cancelada conforme solicitado.\n\n"
                "Se quiser agendar uma nova reunião, pode fazê-lo a qualquer momento:\n"
                "• Através do chat no nosso website\n"
                "• Ou directamente em: https://cal.com/phellipe-oliveira-ncbgsl/30min\n\n"
                "Até breve,\nEquipa GMT"
            )
            _enviar_e_registrar(
                lead_id=str(lead_id),
                tipo="atualizacao_reuniao",
                destinatario=lead_email,
                assunto=assunto,
                corpo=corpo,
                referencia_id=reuniao_id,
                html_override=_build_html_cancelamento_reuniao(
                    lead_nome=lead_nome or "",
                    data_fmt=data_fmt,
                ),
            )
        # Notifica equipe
        notificar_equipe_email.func(
            tipo="alerta_equipe_reuniao",
            assunto=f"[GMT] Reunião cancelada — {lead_nome or lead_id}",
            mensagem=(
                f"Reunião cancelada pelo agente.\n"
                f"Lead: {lead_nome or '(sem nome)'} | {lead_email or '(sem e-mail)'}\n"
                f"Data/hora era: {data_fmt if data_hora else 'desconhecida'}\n"
                f"Reunião ID: {reuniao_id}"
            ),
            referencia_id=reuniao_id,
            lead_ref_ou_id=str(lead_id),
        )
    except Exception as e:
        logger.warning("Falha ao enviar e-mails de cancelamento (reuniao %s): %s", reuniao_id, e)

    return {"message": "Reunião cancelada", "data": {"reuniao_id": reuniao_id, "status": "cancelada"}}


def cancelar_reuniao_via_token(token: str) -> Dict[str, Any]:
    """Cancela reunião a partir de token assinado enviado por e-mail ao titular."""
    try:
        payload = validar_token_acao_reuniao(token, "cancelar")
    except Exception as e:
        return {"error": {"message": str(e)}}

    reuniao_id = payload["rid"]
    email = payload["email"]
    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT r.id, r.lead_id, r.gcal_event_id, r.data_hora, r.status_codigo, "
                "       l.nome, l.email "
                "FROM public.reunioes r "
                "JOIN public.leads l ON l.id = r.lead_id "
                "WHERE r.id=%s "
                "  AND r.status_codigo NOT IN ('cancelada', 'nao_compareceu')",
                (reuniao_id,),
            )
            row = cur.fetchone()
            if not row:
                return {"error": {"message": "Este link já foi utilizado ou a reunião não foi encontrada."}}
            rid, lead_id, gcal_event_id, data_hora, _status_codigo, lead_nome, lead_email = row
            lead_email = (lead_email or "").strip().lower()
            if lead_email != email:
                return {"error": {"message": "Token não corresponde ao titular da reunião"}}
            cur.execute(
                "update public.reunioes set status_codigo='cancelada', atualizado_em=now() where id=%s",
                (reuniao_id,),
            )

    # Google Calendar — remove o evento (best-effort)
    if gcal_event_id:
        try:
            from app.core.gcal import cancelar_evento_gcal
            cancelar_evento_gcal(gcal_event_id)
        except Exception as e:
            logger.warning("Falha ao remover evento GCal: %s", e)

    if data_hora and data_hora.tzinfo is None:
        data_hora = data_hora.replace(tzinfo=ZoneInfo("Europe/Lisbon"))
    data_fmt = (
        data_hora.astimezone(ZoneInfo("Europe/Lisbon")).strftime("%d/%m/%Y às %H:%M")
        if data_hora
        else "data desconhecida"
    )
    _enviar_e_registrar(
        lead_id=str(lead_id),
        tipo="atualizacao_reuniao",
        destinatario=lead_email,
        assunto="Reunião cancelada — GMT",
        corpo=f"Olá {lead_nome}, a sua reunião de {data_fmt} foi cancelada.",
        referencia_id=str(rid),
        html_override=_build_html_cancelamento_reuniao(
            lead_nome=lead_nome or "",
            data_fmt=data_fmt,
        ),
    )
    return {
        "message": "Reunião cancelada com sucesso",
        "data": {"reuniao_id": reuniao_id, "gcal_event_id": gcal_event_id},
    }


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


@tool
def enviar_link_gestao_reuniao(email: str, acao: str = "cancelar_ou_reagendar") -> Dict[str, Any]:
    """Envia para o e-mail do visitante links seguros para cancelar/reagendar reunião.

    Segurança: esta tool não devolve dados da reunião no chat. Apenas dispara o e-mail.
    """
    email_norm = (email or "").strip().lower()
    if not _is_email(email_norm):
        return {"error": {"message": "Informe um e-mail válido."}}

    base_url = (
        os.getenv("PUBLIC_API_BASE_URL")
        or os.getenv("AGENT_API_URL")
        or os.getenv("NEXT_PUBLIC_AGENT_API_URL")
        or "http://localhost:8000"
    ).rstrip("/")
    ttl = int(os.getenv("MEETING_ACTION_TOKEN_TTL_SEC", "172800"))

    with get_conn() as conn:
        with conn.cursor() as cur:
            cur.execute(
                "SELECT r.id, r.data_hora, r.gcal_event_id, r.status_codigo, "
                "       l.nome, l.email, l.id as lead_id "
                "from public.reunioes r "
                "join public.leads l on l.id = r.lead_id "
                "where lower(l.email)=lower(%s) "
                "and r.data_hora > NOW() "
                "and r.status_codigo NOT IN ('cancelada', 'nao_compareceu') "
                "order by r.data_hora asc",
                (email_norm,),
            )
            rows = cur.fetchall() or []

    corpo = [
        "Olá!",
        "",
        "Recebemos o seu pedido para gerir reunião com a GMT.",
        "",
    ]
    lead_id_ref: Optional[str] = None
    lead_nome_ref = "visitante"
    reunioes_links: List[Dict[str, str]] = []
    if rows:
        corpo.append("Para sua segurança, use um dos links abaixo para confirmar a reunião:")
        corpo.append("")
        for idx, (rid, data_hora, _gcal_event_id, status_codigo, _lead_nome, _lead_email, lead_id) in enumerate(rows, start=1):
            lead_id_ref = str(lead_id_ref or lead_id)
            lead_nome_ref = _lead_nome or lead_nome_ref
            _lisbon = ZoneInfo("Europe/Lisbon")
            if data_hora.tzinfo is None:
                data_hora = data_hora.replace(tzinfo=ZoneInfo("UTC"))
            _dt_local = data_hora.astimezone(_lisbon)
            ts = _dt_local.strftime("%d/%m/%Y às %H:%M")
            cancel_token = gerar_token_acao_reuniao(str(rid), email_norm, "cancelar", ttl_sec=ttl)
            cancel_link = f"{base_url}/meeting-actions/cancel?token={cancel_token}"
            reunioes_links.append({"data_fmt": ts, "cancel_link": cancel_link})
            corpo.append(f"{idx}) {ts} ({status_codigo})")
            if acao in ("cancelar", "cancelar_ou_reagendar"):
                corpo.append(f"   - Cancelar esta reunião: {cancel_link}")
            if acao in ("reagendar", "cancelar_ou_reagendar"):
                corpo.append(f"   - Escolher novo horário: {CAL_COM_LINK}")
            corpo.append("")
    else:
        corpo.extend([
            "Não encontramos reuniões futuras com este e-mail neste momento.",
            "",
            f"Se desejar, pode agendar uma nova reunião aqui: {CAL_COM_LINK}",
            "",
        ])

    corpo.extend([
        "Se não foi você quem pediu esta ação, ignore este e-mail.",
        "",
        "Equipe GMT",
    ])

    html_override = _build_html_link_gestao_reuniao(
        lead_nome=lead_nome_ref,
        reunioes=reunioes_links,
        cal_url=CAL_COM_LINK,
    )

    _enviar_e_registrar(
        lead_id=lead_id_ref,
        tipo="atualizacao_reuniao",
        destinatario=email_norm,
        assunto="GMT — link seguro para gerir sua reunião",
        corpo="\n".join(corpo),
        referencia_id=None,
        html_override=html_override,
    )
    return {
        "message": "Se existir reunião para este e-mail, enviámos um link seguro para confirmação.",
        "data": {"enviado": True},
    }


# ═══════════════════════════ NOTIFICAÇÕES (E-MAIL) ═══════════════════════════
EMAIL_EQUIPE = os.getenv("GMT_EMAIL_EQUIPE", "contato@phellipeoliveira.org")


def _corpo_html(texto: str) -> str:
    """Envolve o texto simples em HTML mínimo (mantém quebras de linha)."""
    corpo = (texto or "").replace("\n", "<br>")
    return f'<div style="font-family:Arial,Helvetica,sans-serif;font-size:14px;color:#222">{corpo}</div>'


def _build_html_confirmacao_reuniao(
    lead_nome: str,
    data_fmt: str,
    duracao_min: int,
    meet_link: Optional[str],
) -> str:
    """Retorna o HTML completo do e-mail de confirmação de reunião."""
    if meet_link:
        meet_button = (
            f'<table cellpadding="0" cellspacing="0" border="0">'
            f'<tr><td style="background-color:#000000;border-radius:4px;">'
            f'<a href="{meet_link}" style="display:inline-block;padding:13px 26px;'
            f'font-family:Arial,sans-serif;font-weight:500;font-size:14px;'
            f'color:#ffffff;text-decoration:none;">Entrar na Reunião →</a>'
            f'</td></tr></table>'
        )
    else:
        meet_button = (
            '<p style="margin:0;font-size:14px;color:#555555;">'
            'O link do Google Meet será partilhado próximo à data da reunião.</p>'
        )

    return """<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Host+Grotesk:wght@500;800&display=swap" rel="stylesheet">
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'DM Sans',Arial,sans-serif;">
  <div style="width:100%;padding:40px 0;background-color:#ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e0e0e0;border-collapse:collapse;">
          <tr><td style="padding:40px 40px 20px 40px;">
            <div style="display:inline-block;width:36px;height:36px;background-color:#000000;border-radius:50%;color:#ffffff;text-align:center;line-height:36px;font-family:Arial,sans-serif;font-weight:bold;font-size:11px;letter-spacing:0.5px;">GMT</div>
          </td></tr>
          <tr><td style="padding:0 40px 28px 40px;">
            <p style="margin:0 0 6px 0;font-family:'Host Grotesk',Arial,sans-serif;font-size:30px;font-weight:800;color:#000000;line-height:1.2;">Reunião confirmada ✓</p>
            <p style="margin:0;font-size:15px;color:#666666;">Tudo pronto para o nosso encontro.</p>
          </td></tr>
          <tr><td style="padding:0 40px 24px 40px;font-size:15px;line-height:1.7;color:#1a1a1a;">
            <p style="margin:0;">Olá, <strong>""" + (lead_nome or "visitante") + """</strong>,</p>
            <p style="margin:12px 0 0 0;">A sua reunião com os especialistas da <strong>GMT (Growth Marketing Technology)</strong> está confirmada. Obrigado pelo interesse!</p>
          </td></tr>
          <tr><td style="padding:0 40px 32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f6f6;border-radius:6px;border-collapse:collapse;">
              <tr><td style="padding:22px 24px 10px 24px;">
                <p style="margin:0;font-family:'Host Grotesk',Arial,sans-serif;font-size:11px;font-weight:500;color:#888888;text-transform:uppercase;letter-spacing:1px;">Detalhes da Reunião</p>
              </td></tr>
              <tr><td style="padding:8px 24px;">📅 &nbsp;<strong>""" + data_fmt + """</strong> <span style="color:#888888;font-size:13px;">(fuso Europe/Lisbon)</span></td></tr>
              <tr><td style="padding:8px 24px;">⏱ &nbsp;Duração: até <strong>""" + str(duracao_min) + """ minutos</strong></td></tr>
              <tr><td style="padding:8px 24px 16px 24px;">🎥 &nbsp;Online via <strong>Google Meet</strong></td></tr>
              <tr><td style="padding:4px 24px 24px 24px;">""" + meet_button + """
                <p style="margin:8px 0 0 0;font-size:12px;color:#888888;">Guarde este link — será o mesmo no dia da reunião.</p>
              </td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:0 40px 28px 40px;font-size:15px;line-height:1.7;color:#1a1a1a;">
            <p style="margin:0 0 10px 0;font-family:'Host Grotesk',Arial,sans-serif;font-weight:500;font-size:16px;color:#000000;">O que esperar</p>
            <p style="margin:0;">Vamos perceber a sua necessidade e propor o próximo passo, de forma objetiva e sem pressão. Se quiser, prepare as suas principais dúvidas — mas não é obrigatório.</p>
          </td></tr>
          <tr><td style="padding:0 40px 24px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #e0e0e0;border-collapse:collapse;">
              <tr><td style="padding:20px 0 0 0;font-size:13px;color:#555555;line-height:1.6;">
                📎 O convite de calendário (<strong>.ics</strong>) segue em anexo — abra-o para adicionar ao Google Calendar, Outlook ou Apple Calendar.
              </td></tr>
            </table>
          </td></tr>
          <tr><td style="padding:0 40px 36px 40px;font-size:13px;color:#888888;line-height:1.6;">
            Para remarcar ou cancelar, basta responder a este e-mail ou escrever no chat do nosso website.
          </td></tr>
          <tr><td style="padding:0 40px 40px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-top:1px solid #eeeeee;border-collapse:collapse;">
              <tr><td style="padding-top:20px;">
                <strong style="font-family:'Host Grotesk',Arial,sans-serif;font-size:15px;color:#000000;">Phellipe Oliveira</strong><br>
                <span style="font-size:13px;color:#555555;">Growth Marketing Technology</span><br>
                <a href="https://www.gmt.marketing" style="font-size:13px;color:#000000;text-decoration:underline;">www.gmt.marketing</a>
              </td></tr>
            </table>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </div>
</body>
</html>"""


def _build_html_cancelamento_reuniao(
    lead_nome: str,
    data_fmt: str,
    cal_url: str = "https://cal.com/phellipe-oliveira-ncbgsl/30min",
) -> str:
    """Retorna o HTML do e-mail de cancelamento de reunião."""
    return f"""<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Host+Grotesk:wght@500;800&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'DM Sans',Arial,sans-serif;">
  <div style="width:100%;padding:40px 0;background-color:#ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;width:100%;background-color:#ffffff;
                      border:1px solid #e0e0e0;border-collapse:collapse;">
          <tr>
            <td style="padding:40px 40px 20px 40px;">
              <span style="display:inline-block;background:#000;border-radius:50%;
                           color:#fff;text-align:center;line-height:36px;
                           width:36px;height:36px;font-weight:bold;
                           font-size:11px;letter-spacing:0.5px;">GMT</span>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 28px 40px;">
              <p style="margin:0 0 6px 0;font-family:'Host Grotesk',Arial,sans-serif;
                        font-size:30px;font-weight:800;color:#1a1a1a;line-height:1.2;">
                Reunião cancelada
              </p>
              <p style="margin:0;font-size:15px;color:#666;">
                O seu agendamento foi removido.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 24px 40px;font-size:15px;line-height:1.7;color:#1a1a1a;">
              <p style="margin:0;">Olá, <strong>{lead_nome}</strong>,</p>
              <p style="margin:12px 0 0 0;">
                A sua reunião prevista para <strong>{data_fmt}</strong>
                (hora de Lisboa) foi cancelada conforme solicitado.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color:#f6f6f6;border-radius:6px;border-collapse:collapse;">
                <tr>
                  <td style="padding:22px 24px 10px 24px;">
                    <p style="margin:0;font-family:'Host Grotesk',Arial,sans-serif;
                               font-size:11px;font-weight:500;color:#888;
                               text-transform:uppercase;letter-spacing:1px;">
                      Detalhes do Cancelamento
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 24px;">
                    📅 &nbsp;<strong>{data_fmt}</strong>
                    <span style="color:#888;font-size:13px;">(fuso Europe/Lisbon)</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 24px 24px 24px;">
                    ❌ &nbsp;Reunião cancelada
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 24px 40px;font-size:15px;line-height:1.7;color:#1a1a1a;">
              <p style="margin:0 0 16px 0;">
                Se quiser agendar uma nova reunião, pode fazê-lo a qualquer
                momento através do chat no nosso website ou directamente aqui:
              </p>
              <a href="{cal_url}"
                 style="display:inline-block;background-color:#0a84ff;color:#ffffff;
                        text-decoration:none;padding:14px 28px;border-radius:6px;
                        font-weight:500;font-size:15px;">
                AGENDAR NOVA REUNIÃO
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e0e0e0;
                       font-size:12px;color:#aaa;text-align:center;">
              © GMT — Growth Marketing Technology<br/>
              Se recebeu este e-mail por engano, ignore-o.
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </div>
</body>
</html>"""


def _build_html_remarcacao_reuniao(
    lead_nome: str,
    data_fmt_antiga: str,
    data_fmt_nova: str,
    duracao_min: int,
    cal_url: str = "https://cal.com/phellipe-oliveira-ncbgsl/30min",
) -> str:
    """Retorna o HTML do e-mail de remarcação de reunião."""
    return f"""<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Host+Grotesk:wght@500;800&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'DM Sans',Arial,sans-serif;">
  <div style="width:100%;padding:40px 0;background-color:#ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0"
               style="max-width:600px;width:100%;background-color:#ffffff;
                      border:1px solid #e0e0e0;border-collapse:collapse;">
          <tr>
            <td style="padding:40px 40px 20px 40px;">
              <span style="display:inline-block;background:#000;border-radius:50%;
                           color:#fff;text-align:center;line-height:36px;
                           width:36px;height:36px;font-weight:bold;
                           font-size:11px;letter-spacing:0.5px;">GMT</span>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 28px 40px;">
              <p style="margin:0 0 6px 0;font-family:'Host Grotesk',Arial,sans-serif;
                        font-size:30px;font-weight:800;color:#1a1a1a;line-height:1.2;">
                Reunião remarcada ✓
              </p>
              <p style="margin:0;font-size:15px;color:#666;">
                O seu agendamento foi actualizado.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 24px 40px;font-size:15px;line-height:1.7;color:#1a1a1a;">
              <p style="margin:0;">Olá, <strong>{lead_nome}</strong>,</p>
              <p style="margin:12px 0 0 0;">
                A sua reunião foi remarcada. Veja os novos detalhes abaixo.
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 32px 40px;">
              <table width="100%" cellpadding="0" cellspacing="0" border="0"
                     style="background-color:#f6f6f6;border-radius:6px;border-collapse:collapse;">
                <tr>
                  <td style="padding:22px 24px 10px 24px;">
                    <p style="margin:0;font-family:'Host Grotesk',Arial,sans-serif;
                               font-size:11px;font-weight:500;color:#888;
                               text-transform:uppercase;letter-spacing:1px;">
                      Detalhes da Reunião
                    </p>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 24px;">
                    📅 &nbsp;<strong>Nova data: {data_fmt_nova}</strong>
                    <span style="color:#888;font-size:13px;">(fuso Europe/Lisbon)</span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:4px 24px;">
                    🗓 &nbsp;<span style="color:#aaa;text-decoration:line-through;">
                      Anterior: {data_fmt_antiga}
                    </span>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 24px;">
                    ⏱ &nbsp;Duração: até <strong>{duracao_min} minutos</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 24px;">
                    🎥 &nbsp;Online via <strong>Google Meet</strong>
                  </td>
                </tr>
                <tr>
                  <td style="padding:8px 24px 24px 24px;font-size:13px;color:#888;">
                    O convite de calendário actualizado será enviado em breve.
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:0 40px 24px 40px;font-size:15px;line-height:1.7;color:#1a1a1a;">
              <p style="margin:0 0 16px 0;">
                Se precisar de alterar novamente, escreva no chat do nosso
                website ou aceda directamente:
              </p>
              <a href="{cal_url}"
                 style="display:inline-block;background-color:#0a84ff;color:#ffffff;
                        text-decoration:none;padding:14px 28px;border-radius:6px;
                        font-weight:500;font-size:15px;">
                VER DISPONIBILIDADE
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e0e0e0;
                       font-size:12px;color:#aaa;text-align:center;">
              © GMT — Growth Marketing Technology<br/>
              Se recebeu este e-mail por engano, ignore-o.
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </div>
</body>
</html>"""


def _build_html_link_gestao_reuniao(
    lead_nome: str,
    reunioes: list,
    cal_url: str = "https://cal.com/phellipe-oliveira-ncbgsl/30min",
) -> str:
    itens_html = []
    for r in reunioes or []:
        data_fmt = r.get("data_fmt", "Data indisponível")
        cancel_link = r.get("cancel_link", "#")
        itens_html.append(
            f"""
            <tr><td style="padding:14px 24px;border-top:1px solid #ececec;">
              <p style="margin:0 0 8px 0;font-size:14px;color:#1a1a1a;"><strong>{data_fmt}</strong></p>
              <p style="margin:0 0 6px 0;">
                <a href="{cancel_link}" style="font-size:14px;color:#b42318;text-decoration:none;">❌ Cancelar esta reunião →</a>
              </p>
              <p style="margin:0;">
                <a href="{cal_url}" style="font-size:14px;color:#0a84ff;text-decoration:none;">🔄 Escolher novo horário →</a>
              </p>
            </td></tr>
            """
        )

    if not itens_html:
        itens_html = [
            f"""
            <tr><td style="padding:18px 24px;">
              <p style="margin:0 0 14px 0;font-size:14px;color:#555;">Não encontrámos reuniões futuras com este e-mail.</p>
              <a href="{cal_url}" style="display:inline-block;background-color:#0a84ff;color:#ffffff;
                 text-decoration:none;padding:12px 22px;border-radius:6px;font-weight:500;font-size:14px;">
                Agendar directamente
              </a>
            </td></tr>
            """
        ]

    return f"""<!DOCTYPE html>
<html lang="pt-PT">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500&family=Host+Grotesk:wght@500;800&display=swap" rel="stylesheet"/>
</head>
<body style="margin:0;padding:0;background-color:#ffffff;font-family:'DM Sans',Arial,sans-serif;">
  <div style="width:100%;padding:40px 0;background-color:#ffffff;">
    <table width="100%" cellpadding="0" cellspacing="0" border="0" style="border-collapse:collapse;">
      <tr><td align="center">
        <table width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background-color:#ffffff;border:1px solid #e0e0e0;border-collapse:collapse;">
          <tr><td style="padding:40px 40px 20px 40px;">
            <span style="display:inline-block;background:#000;border-radius:50%;
                         color:#fff;text-align:center;line-height:36px;
                         width:36px;height:36px;font-weight:bold;
                         font-size:11px;letter-spacing:0.5px;">GMT</span>
          </td></tr>
          <tr><td style="padding:0 40px 24px 40px;">
            <p style="margin:0 0 6px 0;font-family:'Host Grotesk',Arial,sans-serif;
                      font-size:30px;font-weight:800;color:#1a1a1a;line-height:1.2;">Gerir a sua reunião</p>
            <p style="margin:0;font-size:15px;color:#666;">Olá, <strong>{lead_nome or "visitante"}</strong>. Use os links abaixo para cancelar ou reagendar.</p>
          </td></tr>
          <tr><td style="padding:0 40px 32px 40px;">
            <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f6f6f6;border-radius:6px;border-collapse:collapse;">
              <tr><td style="padding:18px 24px 10px 24px;">
                <p style="margin:0;font-family:'Host Grotesk',Arial,sans-serif;font-size:11px;font-weight:500;color:#888;text-transform:uppercase;letter-spacing:1px;">Ações disponíveis</p>
              </td></tr>
              {''.join(itens_html)}
            </table>
          </td></tr>
          <tr>
            <td style="padding:24px 40px;border-top:1px solid #e0e0e0;
                       font-size:12px;color:#aaa;text-align:center;">
              © GMT — Growth Marketing Technology<br/>
              Se recebeu este e-mail por engano, ignore-o.
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </div>
</body>
</html>"""


def _enviar_email_resend(
    destinatario: str,
    assunto: str,
    mensagem: str,
    attachments: Optional[List[Dict[str, Any]]] = None,
    html_override: Optional[str] = None,
) -> Tuple[bool, Optional[str], Optional[str]]:
    """Envia um e-mail via Resend.

    `attachments`: lista opcional de dicts {filename, content(base64), content_type}.
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
        payload: Dict[str, Any] = {
            "from": remetente,
            "to": [destinatario],
            "subject": assunto,
            "html": html_override if html_override else _corpo_html(mensagem),
            "text": mensagem,
        }
        if attachments:
            payload["attachments"] = attachments
        result = resend.Emails.send(payload)
        provider_id = result.get("id") if isinstance(result, dict) else getattr(result, "id", None)
        return True, None, provider_id
    except Exception as e:  # noqa: BLE001 — falha de envio não deve quebrar o agente
        logger.warning("Resend: exceção ao enviar para %s (assunto=%r): %s", destinatario, assunto, e)
        return False, str(e), None


def _ics_dt(dt: datetime) -> str:
    """Formata um datetime em UTC no padrão iCalendar (YYYYMMDDTHHMMSSZ)."""
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=ZoneInfo("Europe/Lisbon"))
    return dt.astimezone(timezone.utc).strftime("%Y%m%dT%H%M%SZ")


def _build_ics_reuniao(
    reuniao_id: str,
    nome: Optional[str],
    email: Optional[str],
    inicio: datetime,
    duracao_min: int,
    tipo: str,
    local: Optional[str],
) -> Dict[str, Any]:
    """Monta um anexo .ics (convite de calendário) para o e-mail do lead.

    Contorna a falta de Domain-Wide Delegation: em vez de convidar o lead pela
    Google Calendar API, anexamos o convite ao e-mail — qualquer cliente de e-mail
    consegue adicionar o evento à agenda a partir do .ics.
    """
    remetente = os.getenv("RESEND_FROM_EMAIL") or "no-reply@gmt.marketing"
    fim = inicio + timedelta(minutes=int(duracao_min or 60))
    local_txt = local or ("Online" if tipo == "online" else "A confirmar")
    linhas = [
        "BEGIN:VCALENDAR",
        "VERSION:2.0",
        "PRODID:-//GMT//Agente GMT//PT",
        "CALSCALE:GREGORIAN",
        "METHOD:REQUEST",
        "BEGIN:VEVENT",
        f"UID:{reuniao_id}@gmt",
        f"DTSTAMP:{_ics_dt(datetime.now(timezone.utc))}",
        f"DTSTART:{_ics_dt(inicio)}",
        f"DTEND:{_ics_dt(fim)}",
        f"SUMMARY:Reunião GMT — {nome or 'Lead'}",
        f"DESCRIPTION:Reunião {tipo} com a GMT.",
        f"LOCATION:{local_txt}",
        f"ORGANIZER;CN=GMT:mailto:{remetente}",
    ]
    if email:
        linhas.append(f"ATTENDEE;CN={nome or email};RSVP=TRUE:mailto:{email}")
    linhas += ["STATUS:CONFIRMED", "END:VEVENT", "END:VCALENDAR"]
    conteudo = "\r\n".join(linhas) + "\r\n"
    b64 = base64.b64encode(conteudo.encode("utf-8")).decode("ascii")
    return {"filename": "reuniao-gmt.ics", "content": b64, "content_type": "text/calendar"}


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


def _ja_notificado(tipo: str, referencia_id: Any, destinatario: str) -> bool:
    """True se já existe notificação 'enviado' para (tipo, referencia_id, destinatario).

    Evita e-mails duplicados quando a mesma ação dispara envio por mais de um caminho
    (ex.: a tool agendar_reuniao e depois o AUTO_NOTIFY do update_context).
    Best-effort: qualquer erro de leitura retorna False (não bloqueia o envio).
    """
    if not referencia_id:
        return False
    try:
        with get_conn() as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "select 1 from public.notificacoes "
                    "where tipo=%s and referencia_id=%s and destinatario=%s "
                    "and status_envio='enviado' limit 1",
                    (tipo, str(referencia_id), destinatario),
                )
                return cur.fetchone() is not None
    except Exception:  # noqa: BLE001
        return False


def _enviar_e_registrar(
    lead_id: Optional[str],
    tipo: str,
    destinatario: str,
    assunto: str,
    corpo: str,
    referencia_id: Optional[str],
    attachments: Optional[List[Dict[str, Any]]] = None,
    html_override: Optional[str] = None,
) -> Dict[str, Any]:
    """Envia via Resend (com dedup por referencia_id) e registra em notificacoes.

    Ponto único de envio usado pelas tools de e-mail e pelo agendamento, para que
    a deduplicação e o logging de falha valham para todos os caminhos.
    """
    if _ja_notificado(tipo, referencia_id, destinatario):
        logger.info(
            "E-mail '%s' já enviado para %s (ref %s) — ignorando duplicata.",
            tipo, destinatario, referencia_id,
        )
        return {"enviado": False, "duplicado": True, "erro": None, "notificacao_id": None}
    enviado, erro, _ = _enviar_email_resend(
        destinatario, assunto, corpo,
        attachments=attachments,
        html_override=html_override,
    )
    if not enviado:
        logger.warning("E-mail '%s' NÃO enviado para %s: %s", tipo, destinatario, erro)
    notif_id = _registrar_notificacao(lead_id, tipo, destinatario, assunto, referencia_id, enviado, erro)
    return {"enviado": enviado, "duplicado": False, "erro": erro, "notificacao_id": notif_id}


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
    res = _enviar_e_registrar(lead_id, tipo, destinatario, assunto, corpo, referencia_id)
    if res["duplicado"]:
        return {
            "message": "E-mail já enviado (ignorado para evitar duplicata)",
            "data": {"destinatario": destinatario, "tipo": tipo, "enviado": False, "duplicado": True},
        }
    enviado = res["enviado"]
    return {
        "message": "E-mail de confirmação enviado" if enviado else "Falha ao enviar e-mail de confirmação",
        "data": {
            "notificacao_id": res["notificacao_id"],
            "destinatario": destinatario,
            "tipo": tipo,
            "enviado": enviado,
            "erro": res["erro"],
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
    res = _enviar_e_registrar(lead_id, tipo, EMAIL_EQUIPE, assunto, corpo, referencia_id)
    if res["duplicado"]:
        return {
            "message": "Equipe já notificada (ignorado para evitar duplicata)",
            "data": {"destinatario": EMAIL_EQUIPE, "tipo": tipo, "enviado": False, "duplicado": True},
        }
    enviado = res["enviado"]
    return {
        "message": "Equipe notificada" if enviado else "Falha ao notificar equipe",
        "data": {
            "notificacao_id": res["notificacao_id"],
            "destinatario": EMAIL_EQUIPE,
            "tipo": tipo,
            "enviado": enviado,
            "erro": res["erro"],
        },
    }


# ═══════════════════════════ UTILIDADES ═══════════════════════════
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
