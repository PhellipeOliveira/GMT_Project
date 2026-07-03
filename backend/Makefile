.PHONY: help venv install run dev \
        test test-unit test-rag test-intents test-e2e test-connections \
        rag-ingest supabase-push supabase-status lint

# Usa o Python da venv se existir; senão cai para o python do PATH (fixado em 3.12)
PY := $(shell if [ -x .venv/bin/python ]; then echo .venv/bin/python; else command -v python; fi)

help:
	@echo "Agente GMT — comandos disponíveis:"
	@echo ""
	@echo "  Ambiente"
	@echo "    make venv             - Cria a venv com Python 3.12"
	@echo "    make install          - Instala dependências (requirements.txt)"
	@echo ""
	@echo "  Execução"
	@echo "    make run              - Sobe a API (app.server.webapp:app) em :8000"
	@echo "    make dev              - Abre o LangGraph Studio (langgraph dev)"
	@echo ""
	@echo "  Testes (pytest)"
	@echo "    make test             - Roda toda a suíte (backend/tests)"
	@echo "    make test-unit        - Testes unitários (-m unit)"
	@echo "    make test-rag         - Testes de KB/RAG (-m rag)"
	@echo "    make test-intents     - Testes de intents (-m intents)"
	@echo "    make test-e2e         - Avaliação ponta-a-ponta (-m e2e)"
	@echo "    make test-connections - Valida OpenAI/Supabase/Resend (scripts/test_connections.py)"
	@echo ""
	@echo "  Knowledge Base (RAG)"
	@echo "    make rag-ingest       - Ingere .md do KB (BASE_DIR=kb CATEGORIA= STRATEGY=markdown)"
	@echo ""
	@echo "  Supabase (schema canônico: supabase/migrations/)"
	@echo "    make supabase-push    - Aplica as migrations no projeto linkado (supabase db push)"
	@echo "    make supabase-status  - Lista o estado das migrations (supabase migration list)"
	@echo ""
	@echo "    make lint             - Roda o linter (ruff), se instalado"


# ---- Ambiente (Python 3.12) ----
venv:
	python3.12 -m venv .venv
	@echo "venv criada. Ative com: source .venv/bin/activate"

install:
	$(PY) -m pip install --upgrade pip
	$(PY) -m pip install -r requirements.txt


# ---- Execução ----
run:
	PYTHONPATH=. $(PY) -m uvicorn app.server.webapp:app --reload --host 0.0.0.0 --port 8000

dev:
	$(PY) -m langgraph dev


# ---- Testes ----
test:
	PYTHONPATH=. $(PY) -m pytest -q tests

test-unit:
	PYTHONPATH=. $(PY) -m pytest -q -m unit tests

test-rag:
	PYTHONPATH=. $(PY) -m pytest -q -s -m rag tests

test-intents:
	PYTHONPATH=. $(PY) -m pytest -q -s -m intents tests

test-e2e:
	PYTHONPATH=. $(PY) -m pytest -q -s -m e2e tests

test-connections:
	PYTHONPATH=. $(PY) scripts/test_connections.py


# ---- Knowledge Base (RAG) ----
# Uso: make rag-ingest BASE_DIR=kb CATEGORIA=produto STRATEGY=markdown
rag-ingest:
	PYTHONPATH=. BASE_DIR="$(BASE_DIR)" CATEGORIA="$(CATEGORIA)" STRATEGY="$(STRATEGY)" \
		$(PY) -c "import os; from app.rag.ingest import ingest_dir; \
		print(ingest_dir(os.getenv('BASE_DIR') or 'kb', \
		strategy=os.getenv('STRATEGY') or 'markdown', \
		categoria=os.getenv('CATEGORIA') or None), 'chunks upsertados')"


# ---- Supabase (schema canônico em supabase/migrations/) ----
supabase-push:
	supabase db push

supabase-status:
	supabase migration list


# ---- Lint ----
lint:
	$(PY) -m ruff check . || echo "ruff não instalado (pip install ruff)"

# NOTA: alvos antigos de schema via sql/ (db_apply/db_init/db_seed) e os scripts
# scripts/migrate.py, scripts/db_truncate.py e sql/03_seed_status_gmt.sql foram
# removidos: o schema agora é gerido pelo Supabase CLI (supabase/migrations/).
