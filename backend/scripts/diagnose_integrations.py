#!/usr/bin/env python3
"""
Diagnóstico das integrações do Agente GMT: Google Calendar + Resend.

Foco: descobrir por que (1) o evento não aparece no Google Calendar e
(2) o e-mail de confirmação não chega ao cliente. NÃO altera dados de produção
(o teste de escrita no Calendar cria e depois APAGA um evento temporário, e só
roda com a flag --write-test).

Uso (a partir de backend/):
    python scripts/diagnose_integrations.py
    python scripts/diagnose_integrations.py --write-test   # também testa escrita no Calendar

Checagens:
- Service Account: carrega credenciais (env JSON ou arquivo) e mostra client_email
- Google Calendar: acesso de leitura ao GOOGLE_CALENDAR_ID (+ escrita opcional)
- Resend: domínios verificados e coerência com RESEND_FROM_EMAIL
- Banco: últimas linhas de notificacoes (status/erro) e reunioes (gcal_event_id)

Nenhum segredo é impresso — apenas client_email, calendar id e nomes de domínio.
"""

from __future__ import annotations

import json
import os
import sys

from dotenv import load_dotenv

load_dotenv()

GREEN = "\033[92m"
RED = "\033[91m"
YELLOW = "\033[93m"
RESET = "\033[0m"

SCOPES = ["https://www.googleapis.com/auth/calendar"]


def ok(msg: str) -> bool:
    print(f"{GREEN}[OK]{RESET}   {msg}")
    return True


def fail(msg: str) -> bool:
    print(f"{RED}[FAIL]{RESET} {msg}")
    return False


def warn(msg: str) -> None:
    print(f"{YELLOW}[WARN]{RESET} {msg}")


def info(msg: str) -> None:
    print(f"       {msg}")


# ─────────────────────────── Google Calendar ───────────────────────────
def load_credentials():
    """Carrega a Service Account (env JSON ou arquivo). Retorna (creds, email) ou (None, None)."""
    from google.oauth2 import service_account

    raw = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
    try:
        if raw and raw.strip():
            creds = service_account.Credentials.from_service_account_info(
                json.loads(raw), scopes=SCOPES
            )
            ok("Service Account carregada via GOOGLE_SERVICE_ACCOUNT_JSON (env)")
        else:
            path = os.getenv(
                "GOOGLE_SERVICE_ACCOUNT_FILE", "secrets/google_service_account.json"
            )
            if not os.path.exists(path):
                fail(
                    f"Service Account: arquivo não encontrado em '{path}' "
                    "e GOOGLE_SERVICE_ACCOUNT_JSON está vazio"
                )
                info("→ No Render, use um Secret File e aponte GOOGLE_SERVICE_ACCOUNT_FILE")
                info("  para o caminho absoluto (ex.: /etc/secrets/google_service_account.json),")
                info("  OU cole o JSON inteiro em GOOGLE_SERVICE_ACCOUNT_JSON.")
                return None, None
            creds = service_account.Credentials.from_service_account_file(path, scopes=SCOPES)
            ok(f"Service Account carregada via GOOGLE_SERVICE_ACCOUNT_FILE ({path})")
        email = getattr(creds, "service_account_email", None)
        info(f"client_email: {email}")
        return creds, email
    except Exception as e:  # noqa: BLE001
        fail(f"Service Account: falha ao carregar credenciais: {e}")
        return None, None


def check_calendar_read(creds):
    """Confirma acesso de leitura ao calendário configurado. Retorna o service ou None."""
    from googleapiclient.discovery import build
    from googleapiclient.errors import HttpError

    cal_id = os.getenv("GOOGLE_CALENDAR_ID", "primary")
    info(f"GOOGLE_CALENDAR_ID = {cal_id}")
    if cal_id == "primary":
        warn(
            "GOOGLE_CALENDAR_ID='primary' aponta para o calendário da PRÓPRIA Service Account, "
            "não para a agenda da equipe. Use o ID real da agenda compartilhada."
        )
    try:
        service = build("calendar", "v3", credentials=creds, cache_discovery=False)
        meta = service.calendars().get(calendarId=cal_id).execute()
        ok(f"Leitura do calendário OK: '{meta.get('summary')}'")
        return service
    except HttpError as e:
        status = getattr(getattr(e, "resp", None), "status", None)
        if str(status) == "404":
            fail(f"Calendário NÃO encontrado (404): '{cal_id}'.")
            info("→ ID errado, ou a agenda não foi compartilhada com a Service Account.")
        elif str(status) == "403":
            fail(f"SEM permissão (403) no calendário '{cal_id}'.")
            info("→ Compartilhe a agenda com o client_email da SA (Fazer alterações nos eventos).")
        else:
            fail(f"Erro Google Calendar (HTTP {status}): {e}")
        return None
    except Exception as e:  # noqa: BLE001
        fail(f"Erro ao acessar o Google Calendar: {e}")
        return None


def check_calendar_write(service) -> None:
    """Cria e apaga um evento temporário para provar permissão de ESCRITA."""
    from datetime import datetime, timedelta

    from googleapiclient.errors import HttpError

    cal_id = os.getenv("GOOGLE_CALENDAR_ID", "primary")
    inicio = datetime.now().astimezone() + timedelta(days=1)
    body = {
        "summary": "GMT — teste de diagnóstico (pode apagar)",
        "start": {"dateTime": inicio.isoformat()},
        "end": {"dateTime": (inicio + timedelta(minutes=15)).isoformat()},
    }
    try:
        criado = service.events().insert(calendarId=cal_id, body=body).execute()
        event_id = criado.get("id")
        ok(f"ESCRITA OK: evento de teste criado (id={event_id})")
        try:
            service.events().delete(calendarId=cal_id, eventId=event_id).execute()
            ok("Evento de teste removido.")
        except Exception as e:  # noqa: BLE001
            warn(f"Não consegui apagar o evento de teste (id={event_id}): {e}")
    except HttpError as e:
        status = getattr(getattr(e, "resp", None), "status", None)
        fail(f"ESCRITA FALHOU (HTTP {status}): {e}")
        info("→ A SA vê a agenda mas não tem 'Fazer alterações nos eventos'.")
    except Exception as e:  # noqa: BLE001
        fail(f"ESCRITA FALHOU: {e}")


# ─────────────────────────── Resend ───────────────────────────
def check_resend() -> bool:
    import httpx

    api_key = os.getenv("RESEND_API_KEY")
    remetente = os.getenv("RESEND_FROM_EMAIL")
    if not api_key:
        return fail("Resend: RESEND_API_KEY não definida")
    info(f"RESEND_FROM_EMAIL = {remetente}")
    try:
        resp = httpx.get(
            "https://api.resend.com/domains",
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=10,
        )
        if resp.status_code != 200:
            return fail(f"Resend: HTTP {resp.status_code}: {resp.text[:200]}")
        data = resp.json()
        dominios = data.get("data", data) if isinstance(data, dict) else data
        dominios = dominios if isinstance(dominios, list) else []
        verificados = [d.get("name") for d in dominios if str(d.get("status")).lower() == "verified"]
        nomes = [d.get("name") for d in dominios]

        if not dominios:
            warn(
                "Resend: NENHUM domínio configurado. Em modo teste, o Resend só envia para o "
                "e-mail do dono da conta."
            )
            info("→ Explica: e-mail da EQUIPE chega, e-mail do CLIENTE não chega.")
            info("→ Correção: verifique um domínio no Resend e use um from desse domínio.")
        else:
            ok(f"Resend: domínios={nomes} | verificados={verificados}")

        if remetente and "@" in remetente:
            dominio_from = remetente.split("@", 1)[1].lower()
            if dominio_from not in [str(v).lower() for v in verificados]:
                warn(
                    f"RESEND_FROM_EMAIL usa o domínio '{dominio_from}', que NÃO está verificado. "
                    "Envio para endereços de clientes será bloqueado (só chega ao dono da conta)."
                )
        return True
    except Exception as e:  # noqa: BLE001
        return fail(f"Resend: {e}")


# ─────────────────────────── Banco (evidências) ───────────────────────────
def check_db_evidence() -> None:
    db_url = os.getenv("SUPABASE_DB_URL") or os.getenv("DATABASE_URL")
    if not db_url:
        warn("SUPABASE_DB_URL não definida; pulei a inspeção de notificacoes/reunioes.")
        return
    try:
        import psycopg

        with psycopg.connect(db_url, connect_timeout=10) as conn:
            with conn.cursor() as cur:
                cur.execute(
                    "select tipo, destinatario, status_envio, erro_mensagem, criado_em "
                    "from public.notificacoes order by criado_em desc limit 10"
                )
                rows = cur.fetchall()
                if not rows:
                    warn(
                        "notificacoes: NENHUMA linha. Nenhum e-mail foi tentado "
                        "(lead sem e-mail? agendamento sem confirmação?)."
                    )
                else:
                    info("Últimas notificações:")
                    for tipo, dest, status, erro, ts in rows:
                        marca = f"{GREEN}enviado{RESET}" if status == "enviado" else f"{RED}erro{RESET}"
                        extra = f" | {erro}" if erro else ""
                        info(f"  [{marca}] {ts:%d/%m %H:%M} {tipo} -> {dest}{extra}")

                cur.execute(
                    "select id, data_hora, gcal_event_id, criado_em "
                    "from public.reunioes order by criado_em desc limit 5"
                )
                reun = cur.fetchall()
                if not reun:
                    warn("reunioes: nenhuma reunião registrada ainda.")
                else:
                    info("Últimas reuniões (gcal_event_id):")
                    for rid, dh, gid, ts in reun:
                        marca = f"{GREEN}OK{RESET}" if gid else f"{RED}NULL{RESET}"
                        info(f"  [{marca}] {ts:%d/%m %H:%M} reuniao={rid} gcal_event_id={gid}")
    except Exception as e:  # noqa: BLE001
        fail(f"Banco (notificacoes/reunioes): {e}")


def main() -> int:
    write_test = "--write-test" in sys.argv

    print("== Diagnóstico de integrações do Agente GMT ==\n")

    print("── Google Calendar ──")
    creds, _ = load_credentials()
    service = check_calendar_read(creds) if creds else None
    if service and write_test:
        check_calendar_write(service)
    elif service and not write_test:
        info("(use --write-test para provar também a permissão de escrita)")

    print("\n── Resend (e-mail) ──")
    check_resend()

    print("\n── Evidências no banco ──")
    check_db_evidence()

    print("\n== Fim. Leia os [FAIL]/[WARN] acima na ordem em que apareceram. ==")
    return 0


if __name__ == "__main__":
    sys.exit(main())
