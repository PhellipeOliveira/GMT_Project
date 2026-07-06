"""Endpoints administrativos (somente leitura) para o dashboard interno da GMT.

Protegidos por um token estático no header `X-Admin-Token`, comparado com a env
`ADMIN_API_TOKEN`. Consumidos pelo Next.js (server-side) do dashboard protegido.

São handlers síncronos (`def`): o FastAPI os executa em threadpool, então as
consultas psycopg síncronas não bloqueiam o event loop.
"""
from __future__ import annotations

import hmac
import os
from typing import Any, Dict, List, Optional

from fastapi import APIRouter, Depends, Header, HTTPException, Query

from app.agent.tools import get_conn

router = APIRouter(prefix="/admin", tags=["admin"])


def require_admin(x_admin_token: Optional[str] = Header(default=None)) -> None:
    """Autoriza a requisição comparando X-Admin-Token com ADMIN_API_TOKEN (constante-time)."""
    expected = os.getenv("ADMIN_API_TOKEN")
    if not expected:
        raise HTTPException(status_code=503, detail="Admin API não configurada (ADMIN_API_TOKEN ausente).")
    if not x_admin_token or not hmac.compare_digest(x_admin_token, expected):
        raise HTTPException(status_code=401, detail="Não autorizado.")


def _rows(cur) -> List[Dict[str, Any]]:
    """Converte o resultado do cursor numa lista de dicts (chaveada por nome de coluna)."""
    cols = [d.name for d in cur.description]
    return [dict(zip(cols, r)) for r in (cur.fetchall() or [])]


def _scalar(cur, sql: str, params: tuple = ()) -> int:
    cur.execute(sql, params)
    row = cur.fetchone()
    return int(row[0]) if row and row[0] is not None else 0


@router.get("/summary", dependencies=[Depends(require_admin)])
def summary() -> Dict[str, Any]:
    """Cartões e listas recentes para a visão geral do dashboard."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            totais = {
                "leads": _scalar(cur, "select count(*) from public.leads"),
                "leads_qualificados": _scalar(cur, "select count(*) from public.leads where qualificado=true"),
                "reunioes_proximas": _scalar(
                    cur,
                    "select count(*) from public.reunioes where status_codigo='agendada' and data_hora >= now()",
                ),
                "notificacoes": _scalar(cur, "select count(*) from public.notificacoes"),
                "notificacoes_erro": _scalar(
                    cur, "select count(*) from public.notificacoes where status_envio in ('erro','falhou')"
                ),
                "relatorios": _scalar(cur, "select count(*) from public.relatorios"),
            }
            cur.execute(
                "select id, nome, email, telefone, empresa, status_codigo, qualificado, score, criado_em "
                "from public.leads order by criado_em desc limit 5"
            )
            leads_recentes = _rows(cur)
            cur.execute(
                "select r.id, l.nome as lead_nome, l.email as lead_email, r.data_hora, r.tipo, r.status_codigo "
                "from public.reunioes r left join public.leads l on l.id = r.lead_id "
                "where r.data_hora >= now() order by r.data_hora asc limit 5"
            )
            reunioes_proximas = _rows(cur)
            cur.execute(
                "select id, tipo, destinatario, assunto, status_envio, criado_em "
                "from public.notificacoes order by criado_em desc limit 5"
            )
            notificacoes_recentes = _rows(cur)
    return {
        "totais": totais,
        "leads_recentes": leads_recentes,
        "reunioes_proximas": reunioes_proximas,
        "notificacoes_recentes": notificacoes_recentes,
    }


@router.get("/leads", dependencies=[Depends(require_admin)])
def leads(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    q: Optional[str] = None,
) -> Dict[str, Any]:
    """Lista leads (busca opcional por nome/e-mail/empresa)."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            if q:
                like = f"%{q.lower()}%"
                where = ("where lower(nome) like %s or lower(coalesce(email,'')) like %s "
                         "or lower(coalesce(empresa,'')) like %s")
                params: tuple = (like, like, like)
            else:
                where, params = "", ()
            total = _scalar(cur, f"select count(*) from public.leads {where}", params)
            cur.execute(
                "select id, nome, email, telefone, empresa, origem, status_codigo, qualificado, score, "
                "criado_em, atualizado_em from public.leads "
                f"{where} order by criado_em desc limit %s offset %s",
                (*params, limit, offset),
            )
            items = _rows(cur)
    return {"items": items, "total": total, "limit": limit, "offset": offset}


@router.get("/reunioes", dependencies=[Depends(require_admin)])
def reunioes(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
) -> Dict[str, Any]:
    """Lista reuniões (com nome/e-mail do lead), mais recentes primeiro."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            total = _scalar(cur, "select count(*) from public.reunioes")
            cur.execute(
                "select r.id, r.lead_id, l.nome as lead_nome, l.email as lead_email, "
                "r.data_hora, r.tipo, r.local, r.status_codigo, r.gcal_event_id, r.criado_em "
                "from public.reunioes r left join public.leads l on l.id = r.lead_id "
                "order by r.data_hora desc limit %s offset %s",
                (limit, offset),
            )
            items = _rows(cur)
    return {"items": items, "total": total, "limit": limit, "offset": offset}


@router.get("/notificacoes", dependencies=[Depends(require_admin)])
def notificacoes(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
    status_envio: Optional[str] = None,
) -> Dict[str, Any]:
    """Lista notificações (log de e-mails), mais recentes primeiro."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            if status_envio:
                where, params = "where status_envio=%s", (status_envio,)
            else:
                where, params = "", ()
            total = _scalar(cur, f"select count(*) from public.notificacoes {where}", params)
            cur.execute(
                "select id, lead_id, tipo, destinatario, assunto, referencia_id, status_envio, "
                "erro_mensagem, criado_em, enviado_em from public.notificacoes "
                f"{where} order by criado_em desc limit %s offset %s",
                (*params, limit, offset),
            )
            items = _rows(cur)
    return {"items": items, "total": total, "limit": limit, "offset": offset}


@router.get("/relatorios", dependencies=[Depends(require_admin)])
def relatorios(
    limit: int = Query(50, ge=1, le=200),
    offset: int = Query(0, ge=0),
) -> Dict[str, Any]:
    """Lista relatórios semanais consolidados, período mais recente primeiro."""
    with get_conn() as conn:
        with conn.cursor() as cur:
            total = _scalar(cur, "select count(*) from public.relatorios")
            cur.execute(
                "select id, periodo_inicio, periodo_fim, leads_novos, leads_qualificados, "
                "reunioes_agendadas, reunioes_concluidas, orcamentos_criados, orcamentos_aprovados, "
                "duvidas_total, duvidas_escaladas, taxa_resolucao, enviado, criado_em "
                "from public.relatorios order by periodo_inicio desc limit %s offset %s",
                (limit, offset),
            )
            items = _rows(cur)
    return {"items": items, "total": total, "limit": limit, "offset": offset}
