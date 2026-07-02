"""
Funções auxiliares (helpers) usadas pelo grafo do Agente GMT.

Organização didática:
- tools.py    → ferramentas (I/O, Supabase)
- prompt.py   → prompts do LLM
- helpers.py  → utilitários puros (mensagens/estado/regex)
- workflow.py → grafo (nós, edges, roteamento de intents)
"""
from __future__ import annotations

import re
from typing import Any, Dict, Optional

from langchain_core.messages import BaseMessage

from app.agent import tools as gmt_tools


def extract_text_content(message: BaseMessage) -> str:
    """Extrai texto puro de uma mensagem, lidando com content multimodal."""
    content = message.content
    if isinstance(content, list):
        return next(
            (b["text"] for b in content if isinstance(b, dict) and b.get("type") == "text"),
            "",
        )
    return content if isinstance(content, str) else ""


def ensure_context(state: Dict[str, Any]) -> Dict[str, Any]:
    """Garante um dicionário de contexto mutável no estado."""
    return dict(state.get("context") or {})


def lead_context_from_result(result: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Extrai um contexto de lead a partir do retorno das tools do GMT."""
    if not result or result.get("error"):
        return None
    data = result.get("data") or {}
    if not data.get("lead_id"):
        return None
    return {
        "lead_id": data.get("lead_id"),
        "nome": data.get("nome"),
        "email": data.get("email"),
        "telefone": data.get("telefone"),
        "empresa": data.get("empresa"),
        "etapa_funil": data.get("etapa_funil"),
        "qualificado": data.get("qualificado"),
        "score": data.get("score"),
    }


def get_lead_context(ref: Any) -> Optional[Dict[str, Any]]:
    """Carrega dados básicos do lead a partir de uma referência (uuid/email/telefone/nome/empresa)."""
    if not ref:
        return None
    try:
        response = gmt_tools.obter_lead.invoke({"ref": str(ref)})
    except Exception:  # pragma: no cover
        return None
    return lead_context_from_result(response)


def extract_ref_from_text(text: str) -> Optional[str]:
    """Extrai uma referência provável de lead do texto (uuid, e-mail, telefone)."""
    if not text:
        return None
    m = re.search(
        r"\b[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}\b",
        text,
    )
    if m:
        return m.group(0)
    m = re.search(r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", text)
    if m:
        return m.group(0)
    digits = re.sub(r"\D+", "", text)
    if len(digits) >= 9:  # telefones PT/BR
        return digits
    return None


def has_pending(state: Dict[str, Any]) -> str:
    """Indica se há ações pendentes para execução após `update_context`."""
    ctx = ensure_context(state)
    return "execute" if (ctx.get("pending_actions") or []) else "done"


def push_ai_response(
    ctx: Dict[str, Any],
    intent: str,
    text: str,
    ok: bool = True,
    data: Optional[Dict[str, Any]] = None,
) -> None:
    """Acrescenta um segmento de resposta do turno em context.ai_responses."""
    if ctx is None:
        return
    if ctx.get("ai_responses") is None:
        ctx["ai_responses"] = []
    ctx["ai_responses"].append(
        {
            "intent": intent,
            "text": text or "",
            "ok": bool(ok),
            "data": dict(data or {}),
        }
    )
