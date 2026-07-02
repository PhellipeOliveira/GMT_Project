# Backend do Agente

Backend Python do agente.

## Setup

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # se ainda não existir
```

No macOS, use `python3` para criar o venv (o comando `python` pode não existir fora do ambiente virtual).

Preencha as variáveis em `.env` (principalmente `OPENAI_API_KEY`).

## Executar

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

## Estrutura

```
app/
├── main.py       # entrada FastAPI
├── agent/        # lógica do agente
├── api/          # rotas HTTP
├── core/         # utilitários compartilhados
├── config/       # configuração e settings
├── prompts/      # templates de prompt
└── tools/        # ferramentas do agente
```
