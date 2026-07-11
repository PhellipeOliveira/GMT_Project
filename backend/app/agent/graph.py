"""
Ponte entre a API HTTP (FastAPI) e o grafo LangGraph compilado.

Exporta:
- agent: grafo compilado (MemorySaver + thread_id por sessão)
- normalize_session_id: id estável para histórico no Studio e no site
- prepare_agent_input / format_agent_response: adaptadores para POST /chat
"""

from __future__ import annotations

import json
import re
import uuid
from typing import Any, Dict

from langchain_core.messages import AIMessage, HumanMessage

from app.agent.helpers import extract_text_content
from app.agent.workflow import graph as agent_graph


def build_agent(checkpointer):
    """Compila o grafo do agente com um checkpointer persistente (Postgres/Supabase).

    Usado no lifespan da API para dar memória durável por `thread_id`.
    """
    return agent_graph.compile(checkpointer=checkpointer)


_SESSION_PREFIX = "web:"


def normalize_session_id(session_id: str | None) -> str:
    """Garante um thread_id válido para o checkpointer do LangGraph."""
    raw = (session_id or "").strip() or f"{_SESSION_PREFIX}anon"
    if raw.startswith(_SESSION_PREFIX):
        return raw
    safe = re.sub(r"[^a-zA-Z0-9:_-]", "-", raw)[:128]
    return f"{_SESSION_PREFIX}{safe or uuid.uuid4().hex[:12]}"


def prepare_agent_input(text: str) -> Dict[str, Any]:
    """Converte texto do visitante no formato de estado esperado pelo grafo."""
    return {"messages": [HumanMessage(content=text)]}


def format_agent_response(result: Dict[str, Any]) -> Dict[str, Any]:
    """Extrai resposta amigável para o frontend a partir do estado final do grafo."""
    intent = result.get("intent") or "conversa_geral"
    lead_atual = result.get("lead_atual") or {}
    lead_id = lead_atual.get("lead_id")

    reply_text = ""
    for message in reversed(result.get("messages") or []):
        if isinstance(message, AIMessage):
            reply_text = extract_text_content(message).strip()
            if reply_text:
                break

    ui_hints = None
    ui_match = re.search(r"%%UI%%(.*?)%%", reply_text, flags=re.DOTALL)
    if ui_match:
        ui_hints = json.loads((ui_match.group(1) or "").strip())
        reply_text = re.sub(r"\s*%%UI%%.*?%%\s*", " ", reply_text, count=1, flags=re.DOTALL).strip()

    structured = {
        "message": reply_text,
        "intent": intent,
        "lead_id": lead_id,
        "data": result.get("tool_result") or {},
    }

    return {
        "reply_text": reply_text,
        "intent": intent,
        "lead_id": lead_id,
        "structured": structured,
        "ui_hints": ui_hints,
        "trace_id": "",
    }
