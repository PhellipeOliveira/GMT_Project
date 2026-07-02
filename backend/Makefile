.PHONY: help venv install db_list db_apply db_init db_seed db_truncate db_truncate_yes \
        kb_ingest kb_truncate test test_fast test_unit test_rag test_intents test_e2e \
        run studio lint

# Usa Python da venv se existir; senão, cai para o python do PATH (fixado em 3.12)
PY := $(shell if [ -x .venv/bin/python ]; then echo .venv/bin/python; else command -v python; fi)

help:
	@echo "Agente GMT — comandos disponíveis:"
	@echo ""
	@echo "  Ambiente"
	@echo "    make venv           - Cria a venv com Python 3.12"
	@echo "    make install        - Instala dependencias (requirements.txt)"
	@echo ""
	@echo "  Banco de dados (Supabase) — via scripts/migrate.py"
	@echo "    make db_list        - Lista os arquivos .sql detectados (ordem de execucao)"
	@echo "    make db_init        - Aplica schema do agente + KB (01 e 02)"
	@echo "    make db_apply       - Aplica todos os .sql do diretorio sql/"
	@echo "    make db_seed        - Reaplica apenas o seed de status/etapas"
	@echo "    make db_truncate    - Trunca tabelas do agente (pede confirmacao)"
	@echo "    make db_truncate_yes- Trunca tabelas do agente (sem prompt)"
	@echo ""
	@echo "  Knowledge Base (RAG)"
	@echo "    make kb_ingest      - Ingere .md do site no KB (BASE_DIR=kb CATEGORIA=produto)"
	@echo "    make kb_truncate    - Limpa kb_docs e kb_chunks"
	@echo ""
	@echo "  Testes"
	@echo "    make test           - Roda toda a suite pytest"
	@echo "    make test_fast      - Apenas testes NAO marcados como slow"
	@echo "    make test_unit      - Testes unitarios (helpers/tools puras)"
	@echo "    make test_rag       - Testes do KB/RAG"
	@echo "    make test_intents   - Testes de intents do agente"
	@echo "    make test_e2e       - Avaliacao ponta-a-ponta (roteiros)"
	@echo ""
	@echo "  Execucao"
	@echo "    make run            - Sobe a API (FastAPI/uvicorn) em :8000"
	@echo "    make studio         - Abre o LangGraph Studio (langgraph dev)"
	@echo "    make lint           - Roda o linter (ruff), se instalado"


# ---- Ambiente (Python 3.12 fixo) ----
venv:
	python3.12 -m venv .venv
	@echo "venv criada. Ative com: source .venv/bin/activate"

install:
	$(PY) -m pip install --upgrade pip
	$(PY) -m pip install -r requirements.txt


# ---- Banco de Dados (Supabase) ----
db_list:
	$(PY) scripts/migrate.py --dir sql --list

db_apply:
	$(PY) scripts/migrate.py --dir sql

db_init:
	$(PY) scripts/migrate.py --dir sql --files 01_gmt_agent_schema.sql 02_gmt_kb_schema.sql

db_seed:
	$(PY) scripts/migrate.py --dir sql --files 03_seed_status_gmt.sql

db_truncate:
	$(PY) scripts/db_truncate.py

db_truncate_yes:
	$(PY) scripts/db_truncate.py --yes


# ---- Knowledge Base (RAG) ----
# Uso: make kb_ingest BASE_DIR=kb CATEGORIA=produto STRATEGY=markdown
kb_ingest:
	PYTHONPATH=. BASE_DIR="$(BASE_DIR)" CATEGORIA="$(CATEGORIA)" STRATEGY="$(STRATEGY)" \
		$(PY) -c "import os; from app.rag.ingest import ingest_dir; \
		print(ingest_dir(os.getenv('BASE_DIR') or 'kb', \
		strategy=os.getenv('STRATEGY') or 'markdown', \
		categoria=os.getenv('CATEGORIA') or None), 'chunks upsertados')"

kb_truncate:
	PYTHONPATH=. $(PY) -c "from app.rag.ingest import truncate_kb_tables; truncate_kb_tables(); print('KB limpo (kb_docs + kb_chunks)')"


# ---- Testes ----
test:
	PYTHONPATH=. $(PY) -m pytest -q tests

test_fast:
	PYTHONPATH=. $(PY) -m pytest -q -m "not slow" tests

test_unit:
	PYTHONPATH=. $(PY) -m pytest -q -m unit tests

test_rag:
	PYTHONPATH=. $(PY) -m pytest -q -s -m rag tests

test_intents:
	PYTHONPATH=. $(PY) -m pytest -q -s -m intents tests

test_e2e:
	PYTHONPATH=. $(PY) -m pytest -q -s -m e2e tests


# ---- Execucao ----
run:
	PYTHONPATH=. $(PY) -m uvicorn app.server.webapp:app --reload --port 8000

studio:
	$(PY) -m langgraph dev

lint:
	$(PY) -m ruff check . || echo "ruff nao instalado (pip install ruff)"
