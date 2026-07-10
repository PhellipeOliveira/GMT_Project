# Agente GMT — Backend

Backend Python do agente de recepção da landing page da **GMT** (Growth Marketing Technology).
Construído com **LangGraph + LangChain + FastAPI**, usando **Supabase (PostgreSQL + pgvector)**
como base de dados e RAG.

O agente recepciona visitantes, captura e qualifica leads, responde dúvidas via RAG,
gera orçamentos, agenda reuniões (Google Calendar), envia e-mails (Resend) e gera
relatórios semanais.

## Requisitos

- **Python 3.12** (fixado em `.python-version`)
- Conta/projeto **Supabase** (schema em `supabase/migrations/`)
- Chaves: **OpenAI**, **Resend** e (opcional) **Google Service Account**
- **Supabase CLI** (para aplicar migrations)

## Estrutura

```
backend/
├── app/
│   ├── agent/        # grafo do agente, tools, prompts, helpers, executor ReAct
│   │   ├── workflow.py   # grafo principal (compiled_graph)
│   │   ├── graph.py      # ponte FastAPI ↔ grafo (build_agent, format_agent_response)
│   │   ├── new_react.py  # executor ReAct genérico dos subgrafos
│   │   ├── tools.py      # tools (leads, orçamentos, reuniões, notificações...)
│   │   ├── prompt.py     # prompts do LLM
│   │   └── helpers.py    # utilitários puros de estado/mensagens
│   ├── rag/          # KB / RAG
│   │   ├── rag_tools.py       # kb_search_gmt (vector/text/hybrid)
│   │   ├── ingest.py          # pipeline de ingestão (grafo rag_ingest)
│   │   ├── loaders.py         # loaders/splitters de Markdown
│   │   └── duvida_rag_agent.py # grafo RAG isolado (dev/Studio)
│   ├── core/         # integrações externas
│   │   └── gcal.py        # Google Calendar (push one-way)
│   └── server/       # API HTTP
│       └── webapp.py     # FastAPI real — ENTRYPOINT OFICIAL
├── docs_rag/         # fonte .md do RAG (produto/institucional/faq)
├── docs/             # cheat sheet de intents
├── scripts/          # utilitários (test_connections.py)
├── secrets/          # credenciais locais (NÃO versionar)
├── supabase/         # schema canônico (CLI)
│   ├── config.toml
│   └── migrations/       # migrations SQL versionadas
├── tests/            # pytest (unit/rag/intents/e2e)
├── .env / .env.example
├── langgraph.json    # grafos expostos ao LangGraph Studio
├── Makefile
├── pytest.ini
└── requirements.txt
```

## Setup

```bash
cd backend
python3.12 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -r requirements.txt  # ou: make install
cp .env.example .env             # se ainda não existir; preencha as chaves
```

> No macOS, use `python3.12` para criar a venv. O interpretador oficial do projeto é
> `backend/.venv/bin/python` (já configurado em `.vscode/settings.json`).

Preencha `.env` com, no mínimo: `OPENAI_API_KEY`, `SUPABASE_DB_URL` e `RESEND_API_KEY`.
Veja `.env.example` para a lista completa.

## Rodar a API

Entrypoint oficial: **`app.server.webapp:app`**.

```bash
make run
# equivalente a:
# PYTHONPATH=. uvicorn app.server.webapp:app --reload --host 0.0.0.0 --port 8000
```

Endpoints principais:

- `GET  /health` → healthcheck
- `POST /chat`   → mensagem do visitante → resposta do agente
- `GET  /stream` → resposta em streaming (SSE)

## LangGraph Studio / dev

Os grafos expostos estão em `langgraph.json` (`workflow`, `duvida_rag_agent`, `rag_ingest`):

```bash
make dev
# equivalente a: langgraph dev
```

## Testar conexões externas

Valida OpenAI, Supabase e Resend (sem subir servidor nem enviar e-mails):

```bash
make test-connections
# equivalente a: python scripts/test_connections.py
```

## Testes (pytest)

```bash
make test            # toda a suíte
make test-unit       # -m unit
make test-rag        # -m rag
make test-intents    # -m intents
make test-e2e        # -m e2e
```

As marcas (markers) estão definidas em `pytest.ini`.

## Base de dados — Supabase (migrations)

O schema **canônico** vive em `supabase/migrations/` e é aplicado via **Supabase CLI**
(os comandos abaixo rodam a partir de `backend/`, onde está `supabase/`):

```bash
make supabase-status   # supabase migration list  (estado das migrations)
make supabase-push     # supabase db push          (aplica no projeto linkado)
```

> A antiga pasta `sql/` foi descontinuada como fonte de schema. Não a utilize;
> qualquer mudança de schema deve virar uma nova migration em `supabase/migrations/`.

## Ingestão do KB (RAG)

Os arquivos `.md` em `docs_rag/` alimentam o RAG (tabelas `rag_docs`/`rag_chunks`):

```bash
make rag-ingest BASE_DIR=docs_rag CATEGORIA=produto STRATEGY=markdown
```

Veja `docs_rag/README.txt` para a organização por categorias.

## Segurança

- **Nunca** commite `.env` nem `secrets/` — ambos estão no `.gitignore`.
- `.env.example` (sem valores reais) é o único arquivo de ambiente versionado.
- `secrets/google_service_account.json` deve permanecer apenas local.
- Não exponha as chaves (OpenAI/Supabase/Resend/Google) em logs ou commits.
