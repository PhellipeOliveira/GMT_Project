#!/usr/bin/env python3
"""
Valida as credenciais/serviços externos do Agente GMT (standalone).

Uso:
    python scripts/test_connections.py

Não sobe o servidor e não envia e-mails. Checa:
- OpenAI   → client.models.list()
- Supabase → conecta via SUPABASE_DB_URL (psycopg) e executa SELECT 1
- Resend   → GET /domains com RESEND_API_KEY (só valida a chave)

Saída: [OK]/[FAIL] por serviço. Código de saída != 0 se algum falhar.
"""

from __future__ import annotations

import os
import sys

from dotenv import load_dotenv

load_dotenv()

GREEN = "\033[92m"
RED = "\033[91m"
RESET = "\033[0m"


def ok(msg: str) -> bool:
    print(f"{GREEN}[OK]{RESET}   {msg}")
    return True


def fail(msg: str) -> bool:
    print(f"{RED}[FAIL]{RESET} {msg}")
    return False


def check_openai() -> bool:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return fail("OpenAI: OPENAI_API_KEY não definida no .env")
    try:
        from openai import OpenAI

        client = OpenAI(api_key=api_key)
        models = client.models.list()
        n = len(getattr(models, "data", []) or [])
        return ok(f"OpenAI: chave válida ({n} modelos acessíveis)")
    except Exception as e:  # noqa: BLE001
        return fail(f"OpenAI: {e}")


def check_supabase() -> bool:
    db_url = os.getenv("SUPABASE_DB_URL") or os.getenv("DATABASE_URL")
    if not db_url:
        return fail("Supabase: SUPABASE_DB_URL não definida no .env")
    try:
        import psycopg

        with psycopg.connect(db_url, connect_timeout=10) as conn:
            with conn.cursor() as cur:
                cur.execute("select 1")
                cur.fetchone()
        return ok("Supabase: conexão Postgres OK (SELECT 1)")
    except Exception as e:  # noqa: BLE001
        return fail(f"Supabase: {e}")


def check_resend() -> bool:
    api_key = os.getenv("RESEND_API_KEY")
    if not api_key:
        return fail("Resend: RESEND_API_KEY não definida no .env")
    try:
        import httpx

        resp = httpx.get(
            "https://api.resend.com/domains",
            headers={"Authorization": f"Bearer {api_key}"},
            timeout=10,
        )
        if resp.status_code == 200:
            data = resp.json()
            dominios = data.get("data", data) if isinstance(data, dict) else data
            n = len(dominios) if isinstance(dominios, list) else 0
            return ok(f"Resend: chave válida ({n} domínio(s) configurado(s))")
        try:
            api_msg = resp.json().get("message", resp.text[:200])
        except Exception:  # noqa: BLE001
            api_msg = resp.text[:200]
        if resp.status_code in (400, 401, 403):
            return fail(f"Resend: chave inválida ou sem permissão (HTTP {resp.status_code}): {api_msg}")
        return fail(f"Resend: resposta inesperada (HTTP {resp.status_code}): {api_msg}")
    except Exception as e:  # noqa: BLE001
        return fail(f"Resend: {e}")


def main() -> int:
    print("Testando conexões do Agente GMT...\n")
    resultados = [
        check_openai(),
        check_supabase(),
        check_resend(),
    ]
    print()
    if all(resultados):
        print(f"{GREEN}Tudo certo — todas as conexões OK.{RESET}")
        return 0
    print(f"{RED}Uma ou mais conexões falharam (veja acima).{RESET}")
    return 1


if __name__ == "__main__":
    sys.exit(main())
