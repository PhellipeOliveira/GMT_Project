from __future__ import annotations

import json
import os
import time
from collections import deque
from contextlib import asynccontextmanager
from threading import Lock

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
from app.server.admin import router as admin_router


# ─────────────────────────── Segurança básica ───────────────────────────
def _env_bool(name: str, default: bool) -> bool:
    return (os.getenv(name, str(default)).strip().lower() in ("1", "true", "yes", "on"))


def _env_int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, str(default)))
    except (TypeError, ValueError):
        return default


RATE_LIMIT_ENABLED = _env_bool("RATE_LIMIT_ENABLED", True)
RATE_LIMIT_PER_MIN = _env_int("RATE_LIMIT_PER_MIN", 20)
RATE_LIMIT_WINDOW_SEC = _env_int("RATE_LIMIT_WINDOW_SEC", 60)
CHAT_INPUT_MAX_CHARS = _env_int("CHAT_INPUT_MAX_CHARS", 4000)

# Janela deslizante por IP, em memória. Nota: é por processo — suficiente para um
# Web Service Render de 1 worker. Para múltiplos workers/instâncias, migrar para Redis.
_hits: dict[str, deque[float]] = {}
_hits_lock = Lock()


def _client_ip(req: Request) -> str:
    """IP do cliente respeitando o proxy do Render (X-Forwarded-For: cliente é o 1º)."""
    xff = req.headers.get("x-forwarded-for")
    if xff:
        return xff.split(",")[0].strip()
    return req.client.host if req.client else "unknown"


def _rate_limited(ip: str) -> bool:
    """True se `ip` excedeu RATE_LIMIT_PER_MIN na janela. Faz GC dos timestamps antigos."""
    if not RATE_LIMIT_ENABLED:
        return False
    now = time.monotonic()
    janela = RATE_LIMIT_WINDOW_SEC
    with _hits_lock:
        dq = _hits.setdefault(ip, deque())
        while dq and now - dq[0] > janela:
            dq.popleft()
        if len(dq) >= RATE_LIMIT_PER_MIN:
            return True
        dq.append(now)
        # GC defensivo: evita crescimento ilimitado do dict de IPs ociosos.
        if len(_hits) > 10000:
            for k in [k for k, v in _hits.items() if not v or now - v[-1] > janela]:
                _hits.pop(k, None)
    return False


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


@app.middleware("http")
async def _security_headers(request: Request, call_next):
    """Headers de segurança básicos em todas as respostas."""
    response = await call_next(request)
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "no-referrer")
    return response


app.include_router(admin_router)


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
    if _rate_limited(_client_ip(req)):
        raise HTTPException(
            status_code=429,
            detail="Muitas mensagens em pouco tempo. Aguarde um momento e tente novamente.",
        )
    body = await req.json()
    session_id = normalize_session_id(body.get("session_id", "web:anon"))
    text = body.get("input")
    if not text or not str(text).strip():
        raise HTTPException(status_code=400, detail="Campo 'input' é obrigatório")
    if len(str(text)) > CHAT_INPUT_MAX_CHARS:
        raise HTTPException(
            status_code=413,
            detail=f"Mensagem muito longa (máx. {CHAT_INPUT_MAX_CHARS} caracteres).",
        )
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
    if _rate_limited(_client_ip(req)):
        raise HTTPException(
            status_code=429,
            detail="Muitas mensagens em pouco tempo. Aguarde um momento e tente novamente.",
        )
    if not input or not input.strip():
        raise HTTPException(status_code=400, detail="Campo 'input' é obrigatório")
    if len(input) > CHAT_INPUT_MAX_CHARS:
        raise HTTPException(
            status_code=413,
            detail=f"Mensagem muito longa (máx. {CHAT_INPUT_MAX_CHARS} caracteres).",
        )
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
