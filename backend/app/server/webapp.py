from __future__ import annotations

import json
import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from psycopg.rows import dict_row
from psycopg_pool import AsyncConnectionPool
from langgraph.checkpoint.postgres.aio import AsyncPostgresSaver

from app.agent.graph import (
    build_agent,
    format_agent_response,
    normalize_session_id,
    prepare_agent_input,
)


def _db_url() -> str:
    url = os.getenv("SUPABASE_DB_URL") or os.getenv("DATABASE_URL")
    if not url:
        raise RuntimeError("SUPABASE_DB_URL (ou DATABASE_URL) não definido no .env")
    return url


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Inicializa o pool Postgres + checkpointer e compila o agente persistente."""
    async with AsyncConnectionPool(
        conninfo=_db_url(),
        min_size=1,
        max_size=10,
        open=False,
        kwargs={"autocommit": True, "row_factory": dict_row},
    ) as pool:
        checkpointer = AsyncPostgresSaver(pool)
        await checkpointer.setup()  # cria as tabelas de checkpoint (idempotente)
        app.state.agent = build_agent(checkpointer)
        yield


app = FastAPI(title="Agente GMT — Recepção da Landing Page", lifespan=lifespan)

# A landing page (Next.js) consome este backend via fetch.
_cors_raw = (os.getenv("CORS_ORIGINS") or "").strip()
if _cors_raw:
    _cors_origins = [o for o in (d.strip() for d in _cors_raw.split(",")) if o]
else:
    _cors_origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


def cfg(session_id: str):
    return {"configurable": {"thread_id": session_id}}


@app.get("/health")
async def health():
    return {"status": "ok", "service": "agente-gmt"}


@app.get("/config")
async def config():
    """Expõe configuração pública do widget para o front-end Next.js."""
    enabled = os.getenv("AGENT_WIDGET_ENABLED", "false").strip().lower() == "true"
    return {"widget_enabled": enabled}


@app.post("/chat")
async def chat(req: Request):
    """Endpoint principal: recebe a mensagem do visitante e devolve a resposta do agente."""
    body = await req.json()
    session_id = normalize_session_id(body.get("session_id", "web:anon"))
    text = body.get("input")
    if not text:
        raise HTTPException(status_code=400, detail="Campo 'input' é obrigatório")
    try:
        result = await req.app.state.agent.ainvoke(
            prepare_agent_input(text),
            config=cfg(session_id),
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Erro ao invocar agente: {e}")

    return format_agent_response(result)


@app.get("/stream")
async def stream(req: Request, session_id: str, input: str):
    """Streaming de eventos (SSE) para exibir a resposta do agente em tempo real no chat do site."""
    sid = normalize_session_id(session_id)
    agent = req.app.state.agent

    async def gen():
        async for chunk in agent.astream(
            prepare_agent_input(input),
            config=cfg(sid),
        ):
            yield f"data: {json.dumps(chunk, default=str, ensure_ascii=False)}\n\n"
        yield "event: done\ndata: {}\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream")
