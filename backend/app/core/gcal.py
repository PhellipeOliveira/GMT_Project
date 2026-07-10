"""
Google Calendar — push one-way (visualização, não fonte de verdade).

A fonte de verdade das reuniões é a tabela `public.reunioes` no Supabase.
Este helper apenas espelha uma reunião confirmada como evento no Google Calendar.

Autenticação: Service Account, sem OAuth interativo em runtime.
Variáveis de ambiente:
- GOOGLE_SERVICE_ACCOUNT_JSON  (conteúdo JSON da chave — preferido em produção/Render)
- GOOGLE_SERVICE_ACCOUNT_FILE  (caminho do arquivo .json — default: secrets/google_service_account.json)
- GOOGLE_CALENDAR_ID (default: primary)

Nota operacional: para adicionar `attendees` (convidar o lead), a Service Account
geralmente precisa de Domain-Wide Delegation; sem isso a API pode recusar o convite.
O chamador (agendar_reuniao) trata qualquer exceção e mantém a reunião confirmada.
"""

from __future__ import annotations

import json
import os
from datetime import datetime, timedelta
from datetime import time as dtime
from typing import Any, Dict, Optional

DEFAULT_TZ = "Europe/Lisbon"
DEFAULT_DURACAO_MIN = 60
SCOPES = ["https://www.googleapis.com/auth/calendar"]


def _convidar_attendees() -> bool:
    """Só inclui attendees se GOOGLE_CALENDAR_INVITE_ATTENDEES=true.

    Default false: evita erro de permissão até a Service Account ter
    Domain-Wide Delegation configurada.
    """
    return os.getenv("GOOGLE_CALENDAR_INVITE_ATTENDEES", "false").strip().lower() in (
        "1",
        "true",
        "yes",
        "on",
    )


def _load_credentials():
    """Carrega as credenciais da Service Account.

    Ordem de resolução (importante para Render/produção, onde muitas vezes não há
    arquivo em disco):
    1. GOOGLE_SERVICE_ACCOUNT_JSON — conteúdo JSON da chave, direto na variável.
    2. GOOGLE_SERVICE_ACCOUNT_FILE — caminho para o arquivo .json (default local).

    Levanta exceção clara se nenhuma fonte válida existir.
    """
    from google.oauth2 import service_account

    raw_json = os.getenv("GOOGLE_SERVICE_ACCOUNT_JSON")
    if raw_json and raw_json.strip():
        try:
            info = json.loads(raw_json)
        except json.JSONDecodeError as e:
            raise ValueError(
                "GOOGLE_SERVICE_ACCOUNT_JSON está definido mas não é um JSON válido."
            ) from e
        return service_account.Credentials.from_service_account_info(info, scopes=SCOPES)

    key_file = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", "secrets/google_service_account.json")
    if not os.path.exists(key_file):
        raise FileNotFoundError(
            f"Service Account não encontrada: defina GOOGLE_SERVICE_ACCOUNT_JSON "
            f"ou garanta que GOOGLE_SERVICE_ACCOUNT_FILE aponte para um arquivo existente "
            f"(atual: '{key_file}')."
        )
    return service_account.Credentials.from_service_account_file(key_file, scopes=SCOPES)


def _build_service():
    """Constrói o cliente da Calendar API a partir da Service Account."""
    from googleapiclient.discovery import build

    credentials = _load_credentials()
    return build("calendar", "v3", credentials=credentials, cache_discovery=False)


def criar_evento_gcal(reuniao: Dict[str, Any]) -> Dict[str, Optional[str]]:
    """Cria um evento no Google Calendar espelhando a reunião. Retorna um dict com as chaves 'gcal_event_id' e 'meet_link' (ambos podem ser None em caso de falha).

    Espera um dict com: reuniao_id, lead_nome, lead_email, data_hora (ISO/str ou datetime),
    duracao_min, tipo, local, timezone.
    """
    calendar_id = os.getenv("GOOGLE_CALENDAR_ID", "primary")
    tz = reuniao.get("timezone") or DEFAULT_TZ

    data_hora = reuniao.get("data_hora")
    if isinstance(data_hora, str):
        data_hora = datetime.fromisoformat(data_hora)
    if not isinstance(data_hora, datetime):
        raise ValueError("reuniao['data_hora'] inválido")

    duracao = int(reuniao.get("duracao_min") or DEFAULT_DURACAO_MIN)
    fim = data_hora + timedelta(minutes=duracao)

    nome = reuniao.get("lead_nome") or "Lead"
    titulo = f"Reunião GMT — {nome}"
    tipo = reuniao.get("tipo") or "online"

    descricao_partes = [f"Tipo: {tipo}"]
    if reuniao.get("local"):
        descricao_partes.append(f"Local: {reuniao['local']}")
    descricao_partes.append(f"Lead: {nome}")
    if reuniao.get("reuniao_id"):
        descricao_partes.append(f"Reunião ID: {reuniao['reuniao_id']}")
    descricao = "\n".join(descricao_partes)

    evento: Dict[str, Any] = {
        "summary": titulo,
        "description": descricao,
        "start": {"dateTime": data_hora.isoformat(), "timeZone": tz},
        "end": {"dateTime": fim.isoformat(), "timeZone": tz},
        "conferenceData": {
            "createRequest": {
                "requestId": f"gmt_meet_{reuniao.get('reuniao_id')}",
                "conferenceSolutionKey": {"type": "hangoutLink"},
            }
        },
    }
    if reuniao.get("lead_email") and _convidar_attendees():
        evento["attendees"] = [{"email": reuniao["lead_email"]}]

    service = _build_service()
    criado = service.events().insert(
        calendarId=calendar_id,
        body=evento,
        conferenceDataVersion=1,
    ).execute()
    return {
        "gcal_event_id": criado.get("id"),
        "meet_link": criado.get("hangoutLink"),
    }


def listar_slots_ocupados_gcal(
    data_inicio_iso: str,
    data_fim_iso: str,
) -> set:
    """Lê eventos do Google Calendar no intervalo informado e retorna um set de datetimes
    UTC (sem microsegundos) que representam slots ocupados (a cada 30 min dentro do evento).

    Usado por `verificar_disponibilidade` em tools.py para garantir que slots já bloqueados
    no Google Calendar não sejam oferecidos ao visitante, mesmo que não estejam no Supabase.

    Parâmetros em formato ISO 8601 com offset (ex.: "2026-07-14T13:00:00+01:00").
    Retorna set vazio em caso de falha (best-effort: não interrompe a verificação).
    """
    from datetime import timezone, timedelta
    try:
        service = _build_service()
        calendar_id = os.getenv("GOOGLE_CALENDAR_ID", "primary")
        events_result = service.events().list(
            calendarId=calendar_id,
            timeMin=data_inicio_iso,
            timeMax=data_fim_iso,
            singleEvents=True,
            orderBy="startTime",
        ).execute()

        ocupados: set = set()
        passo = timedelta(minutes=30)

        for event in events_result.get("items", []):
            start_raw = event.get("start", {}).get("dateTime") or event.get("start", {}).get("date")
            end_raw = event.get("end", {}).get("dateTime") or event.get("end", {}).get("date")
            if not start_raw or not end_raw:
                continue
            try:
                start_dt = datetime.fromisoformat(start_raw)
                end_dt = datetime.fromisoformat(end_raw)
                if start_dt.tzinfo is None:
                    start_dt = start_dt.replace(tzinfo=timezone.utc)
                if end_dt.tzinfo is None:
                    end_dt = end_dt.replace(tzinfo=timezone.utc)
                t = start_dt.astimezone(timezone.utc).replace(microsecond=0, second=0)
                fim = end_dt.astimezone(timezone.utc).replace(microsecond=0, second=0)
                while t < fim:
                    ocupados.add(t)
                    t += passo
            except Exception:
                continue

        return ocupados

    except Exception as gcal_err:
        import logging
        logging.getLogger(__name__).warning(
            "Falha ao ler eventos do Google Calendar para disponibilidade: %s", gcal_err
        )
        return set()
