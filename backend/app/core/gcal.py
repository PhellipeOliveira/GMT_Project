"""
Google Calendar — push one-way (visualização, não fonte de verdade).

A fonte de verdade das reuniões é a tabela `public.reunioes` no Supabase.
Este helper apenas espelha uma reunião confirmada como evento no Google Calendar.

Autenticação: Service Account (JSON key file), sem OAuth interativo em runtime.
Variáveis de ambiente:
- GOOGLE_SERVICE_ACCOUNT_FILE (default: secrets/google_service_account.json)
- GOOGLE_CALENDAR_ID (default: primary)

Nota operacional: para adicionar `attendees` (convidar o lead), a Service Account
geralmente precisa de Domain-Wide Delegation; sem isso a API pode recusar o convite.
O chamador (agendar_reuniao) trata qualquer exceção e mantém a reunião confirmada.
"""

from __future__ import annotations

import os
from datetime import datetime, timedelta
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


def _build_service():
    """Constrói o cliente da Calendar API a partir da Service Account."""
    from google.oauth2 import service_account
    from googleapiclient.discovery import build

    key_file = os.getenv("GOOGLE_SERVICE_ACCOUNT_FILE", "secrets/google_service_account.json")
    credentials = service_account.Credentials.from_service_account_file(key_file, scopes=SCOPES)
    return build("calendar", "v3", credentials=credentials, cache_discovery=False)


def criar_evento_gcal(reuniao: Dict[str, Any]) -> Optional[str]:
    """Cria um evento no Google Calendar espelhando a reunião. Retorna o event_id (ou None).

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
    }
    if reuniao.get("lead_email") and _convidar_attendees():
        evento["attendees"] = [{"email": reuniao["lead_email"]}]

    service = _build_service()
    criado = service.events().insert(calendarId=calendar_id, body=evento).execute()
    return criado.get("id")
