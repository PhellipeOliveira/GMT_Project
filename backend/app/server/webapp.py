from __future__ import annotations

import html
import json
import os
import time
from collections import deque
from contextlib import asynccontextmanager
from threading import Lock

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse, StreamingResponse
from pydantic import BaseModel, ConfigDict, Field, field_validator
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
from app.agent.tools import cancelar_reuniao_via_token


# ─────────────────────────── Segurança básica ───────────────────────────
def _env_bool(name: str, default: bool) -> bool:
    return (os.getenv(name, str(default)).strip().lower() in ("1", "true", "yes", "on"))


def _env_int(name: str, default: int) -> int:
    try:
        return int(os.getenv(name, str(default)))
    except (TypeError, ValueError):
        return default


def _is_production() -> bool:
    vals = [
        (os.getenv("APP_ENV") or "").strip().lower(),
        (os.getenv("NODE_ENV") or "").strip().lower(),
    ]
    if "production" in vals:
        return True
    return (os.getenv("RENDER") or "").strip().lower() in ("1", "true", "yes", "on")


IS_PROD = _is_production()
RATE_LIMIT_ENABLED = _env_bool("RATE_LIMIT_ENABLED", True)
RATE_LIMIT_PER_MIN = _env_int("RATE_LIMIT_PER_MIN", (30 if IS_PROD else 20))
RATE_LIMIT_CHAT_PER_MIN = _env_int("RATE_LIMIT_CHAT_PER_MIN", RATE_LIMIT_PER_MIN)
RATE_LIMIT_STREAM_PER_MIN = _env_int("RATE_LIMIT_STREAM_PER_MIN", max(5, RATE_LIMIT_CHAT_PER_MIN // 2))
RATE_LIMIT_MEETING_ACTION_PER_10MIN = _env_int("RATE_LIMIT_MEETING_ACTION_PER_10MIN", (10 if IS_PROD else 20))
RATE_LIMIT_WINDOW_SEC = _env_int("RATE_LIMIT_WINDOW_SEC", 60)
CHAT_INPUT_MAX_CHARS = _env_int("CHAT_INPUT_MAX_CHARS", 4000)
STREAM_ENDPOINT_ENABLED = _env_bool("STREAM_ENDPOINT_ENABLED", False)
TRUST_PROXY_HEADERS = _env_bool("TRUST_PROXY_HEADERS", IS_PROD)
SECURITY_HEADERS_ENABLED = _env_bool("SECURITY_HEADERS_ENABLED", True)
SECURITY_HSTS_MAX_AGE = _env_int("SECURITY_HSTS_MAX_AGE", 31536000)
SECURITY_ENABLE_HSTS = _env_bool("SECURITY_ENABLE_HSTS", IS_PROD)


class ChatRequest(BaseModel):
    """Payload validado do endpoint /chat."""

    model_config = ConfigDict(extra="forbid")

    session_id: str = Field(default="web:anon", min_length=1, max_length=256)
    input: str = Field(min_length=1, max_length=10000)

    @field_validator("session_id")
    @classmethod
    def _session_id_not_blank(cls, v: str) -> str:
        s = (v or "").strip()
        if not s:
            return "web:anon"
        return s

    @field_validator("input")
    @classmethod
    def _input_not_blank(cls, v: str) -> str:
        s = (v or "").strip()
        if not s:
            raise ValueError("Campo 'input' é obrigatório")
        if len(s) > CHAT_INPUT_MAX_CHARS:
            raise ValueError(f"Mensagem muito longa (máx. {CHAT_INPUT_MAX_CHARS} caracteres).")
        return s

# Janela deslizante por IP, em memória. Nota: é por processo — suficiente para um
# Web Service Render de 1 worker. Para múltiplos workers/instâncias, migrar para Redis.
_hits: dict[str, deque[float]] = {}
_hits_lock = Lock()


def _client_ip(req: Request) -> str:
    """Extrai IP do cliente (com proxy confiável em produção)."""
    if TRUST_PROXY_HEADERS:
        cf_ip = (req.headers.get("cf-connecting-ip") or "").strip()
        if cf_ip:
            return cf_ip
        xff = req.headers.get("x-forwarded-for")
        if xff:
            return xff.split(",")[0].strip()
    return req.client.host if req.client else "unknown"


def _request_is_https(req: Request) -> bool:
    if str(req.url.scheme).lower() == "https":
        return True
    if TRUST_PROXY_HEADERS:
        proto = (req.headers.get("x-forwarded-proto") or "").split(",")[0].strip().lower()
        return proto == "https"
    return False


def _rate_limited(key: str, limit: int, window_sec: int) -> bool:
    """True se `key` excedeu `limit` na janela `window_sec`."""
    if not RATE_LIMIT_ENABLED:
        return False
    now = time.monotonic()
    janela = max(int(window_sec), 1)
    with _hits_lock:
        dq = _hits.setdefault(key, deque())
        while dq and now - dq[0] > janela:
            dq.popleft()
        if len(dq) >= max(int(limit), 1):
            return True
        dq.append(now)
        # GC defensivo: evita crescimento ilimitado do dict de IPs ociosos.
        if len(_hits) > 10000:
            for k in [k for k, v in _hits.items() if not v or now - v[-1] > janela]:
                _hits.pop(k, None)
    return False


def _enforce_rate_limit(route: str, req: Request, *, limit: int, window_sec: int) -> None:
    ip = _client_ip(req)
    key = f"{route}:{ip}"
    if _rate_limited(key, limit=limit, window_sec=window_sec):
        retry_after = str(max(int(window_sec), 1))
        raise HTTPException(
            status_code=429,
            detail="Muitas requisições em pouco tempo. Aguarde e tente novamente.",
            headers={"Retry-After": retry_after},
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
if IS_PROD and not _cors_raw:
    raise RuntimeError("CORS_ORIGINS deve ser configurado em produção.")
if _cors_raw:
    _cors_origins = [o for o in (d.strip() for d in _cors_raw.split(",")) if o]
else:
    _cors_origins = ["*"]
if IS_PROD and any(o == "*" for o in _cors_origins):
    raise RuntimeError("CORS_ORIGINS não pode conter '*' em produção.")

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.middleware("http")
async def _security_headers(request: Request, call_next):
    """Headers de segurança em todas as respostas."""
    response = await call_next(request)
    if not SECURITY_HEADERS_ENABLED:
        return response

    # API-first CSP: nega execução/embeds por padrão.
    response.headers.setdefault(
        "Content-Security-Policy",
        "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
    )
    response.headers.setdefault("X-Content-Type-Options", "nosniff")
    response.headers.setdefault("X-Frame-Options", "DENY")
    response.headers.setdefault("Referrer-Policy", "strict-origin-when-cross-origin")
    response.headers.setdefault("Permissions-Policy", "camera=(), microphone=(), geolocation=()")
    response.headers.setdefault("Cross-Origin-Opener-Policy", "same-origin")
    response.headers.setdefault("X-Permitted-Cross-Domain-Policies", "none")
    if SECURITY_ENABLE_HSTS and _request_is_https(request):
        response.headers.setdefault(
            "Strict-Transport-Security",
            f"max-age={max(SECURITY_HSTS_MAX_AGE, 0)}; includeSubDomains; preload",
        )
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
async def chat(payload: ChatRequest, req: Request):
    """Endpoint principal: recebe a mensagem do visitante e devolve a resposta do agente."""
    _enforce_rate_limit(
        "chat",
        req,
        limit=RATE_LIMIT_CHAT_PER_MIN,
        window_sec=RATE_LIMIT_WINDOW_SEC,
    )
    session_id = normalize_session_id(payload.session_id)
    text = payload.input
    try:
        result = await req.app.state.agent.ainvoke(
            prepare_agent_input(text),
            config=cfg(session_id),
        )
    except Exception:
        raise HTTPException(status_code=500, detail="Erro interno ao processar a mensagem.")

    return format_agent_response(result)


@app.get("/stream")
async def stream(req: Request, session_id: str, input: str):
    """Streaming de eventos (SSE) para exibir a resposta do agente em tempo real no chat do site."""
    if not STREAM_ENDPOINT_ENABLED:
        raise HTTPException(status_code=404, detail="Streaming desativado.")
    _enforce_rate_limit(
        "stream",
        req,
        limit=RATE_LIMIT_STREAM_PER_MIN,
        window_sec=RATE_LIMIT_WINDOW_SEC,
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


@app.get("/meeting-actions/cancel", response_class=HTMLResponse)
async def cancel_meeting_by_email_link(token: str, req: Request):
    """Cancela reunião por link seguro enviado ao e-mail do titular."""
    _enforce_rate_limit(
        "meeting_action_cancel",
        req,
        limit=RATE_LIMIT_MEETING_ACTION_PER_10MIN,
        window_sec=600,
    )
    result = cancelar_reuniao_via_token(token)
    if result.get("error"):
        msg = html.escape(str(result["error"].get("message") or "Não foi possível validar o link."))
        return HTMLResponse(
            content=f"<html><body><h2>Não foi possível concluir</h2><p>{msg}</p></body></html>",
            status_code=400,
        )
    return HTMLResponse(
        content=(
            "<html><body>"
            "<h2>Reunião cancelada com sucesso</h2>"
            "<p>Se quiser, você pode agendar um novo horário pelo link que recebeu no e-mail.</p>"
            "</body></html>"
        )
    )
