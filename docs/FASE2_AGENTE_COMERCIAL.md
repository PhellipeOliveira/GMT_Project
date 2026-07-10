# Agente Comercial — Plano de Integração (Fase 2)

> Documento de referência para o desenvolvimento futuro do Agente Comercial.
> Criado em: 2026-07-10
> Estado: planejamento — Fase 2 ainda não iniciada.

## Arquitetura

O Agente GMT (Fase 1) é a **receção digital** — opera via widget no website, captura leads e agenda reuniões.
O Agente Comercial é um **projeto Python/LangGraph separado** que consome dados do GMT via webhook REST.

[Widget Site] ──→ [Agente GMT — Fase 1]
│
webhook REST (POST /webhook/comercial)
│
[Agente Comercial — Fase 2] ←── [EspoCRM]


## Responsabilidades por Agente

Funcionalidade	GMT Fase 1	Agente Comercial Fase 2
Chat widget no site	✅	❌
RAG (FAQ, documentos)	✅	❌
Cadastro de leads	✅	read-only
Agendamento de reuniões	✅	read-only
E-mail confirmação (Resend)	✅	❌
Google Calendar	✅	❌
Orçamentos	❌	✅
Nutrição de leads	❌	✅
Relatórios semanais/mensais	❌	✅
Memória persistente entre sessões	❌	✅
Integração EspoCRM	❌	✅
Dashboard	❌	✅
Humano no loop (notificação responsável)	❌	✅

Endpoint a Implementar no GMT (quando Fase 2 iniciar)

# app/server/webapp.py — adicionar na Fase 2
@app.post("/webhook/comercial")
async def comercial_webhook(request: Request):
    """Endpoint seguro para o Agente Comercial consultar dados do GMT."""
    auth = request.headers.get("Authorization", "")
    if auth != f"Bearer {os.getenv('GMT_WEBHOOK_SECRET')}":
        raise HTTPException(status_code=401, detail="Não autorizado")
    body = await request.json()
    action = body.get("action")
    # Ações a implementar: get_lead, list_leads, get_reunioes, get_duvidas
    ...

Variável de ambiente a adicionar ao .env do GMT:

GMT_WEBHOOK_SECRET=<gerar com: openssl rand -hex 32>
Payloads de Exemplo

// Listar leads por status
{ "action": "list_leads", "status": "qualificado", "limit": 50 }

// Obter reuniões de um período
{ "action": "get_reunioes", "data_inicio": "2026-07-01", "data_fim": "2026-07-31" }

// Obter lead específico
{ "action": "get_lead", "lead_id": "uuid-aqui" }

Tabelas do GMT disponíveis para leitura (Agente Comercial)

Tabela	Conteúdo
public.leads	Todos os leads captados
public.reunioes	Reuniões agendadas
public.duvidas	Histórico de perguntas RAG
public.notificacoes	Log de e-mails enviados

Referências do Código Removido na Fase 1
O código de Fase 2 (orçamentos, nutrição, relatórios, escalada) foi removido do projeto GMT.
O backup completo do código anterior está guardado localmente pelo dev.

Funções a reimplementar no projeto do Agente Comercial (com acesso ao schema GMT via webhook):

criar_orcamento, adicionar_item_orcamento, calcular_totais_orcamento, exportar_orcamento
iniciar_sequencia_nutricao, pausar_sequencia_nutricao, status_sequencia_nutricao
gerar_relatorio_semanal
escalar_duvida_humano (notificação via Resend ou WhatsApp)
qualificar_lead, classificar_lead (atualiza leads via webhook GMT)
Confirma quando o arquivo for criado.
