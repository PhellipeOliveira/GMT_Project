# Mapa de Integração EspoCRM ↔ Agente GMT

> Documento técnico de referência para a **futura** integração entre o EspoCRM (CRM comercial)
> e o Agente GMT (camada de inteligência e orquestração).
>
> **Status:** desenho / documentação. Nenhum código, migration ou arquivo existente foi alterado.
> **Premissa central:** a integração com o EspoCRM será feita **via API REST do EspoCRM**, nunca
> por acesso direto ao banco MariaDB do CRM.
>
> Este documento é fiel à arquitetura atual do repositório: usa nomes reais de arquivos, funções,
> tabelas, campos, tools e intents encontrados no código em `07/07/2026`.

---

## 1. Objetivo da integração

O ecossistema tem três papéis bem definidos, que **não** mudam com a integração:

| Componente | Papel | Natureza |
|---|---|---|
| **Agente GMT** | Camada de inteligência e orquestração. Recepciona visitantes, classifica intenção, executa tools, decide o que persistir e o que notificar. | LangGraph + LangChain + FastAPI (Python) |
| **Supabase / Postgres** | Fonte de verdade **interna** e base operacional: dados de negócio, memória de conversa (checkpoints LangGraph), RAG (pgvector) e auditoria. | PostgreSQL + pgvector |
| **EspoCRM** | CRM **comercial**. Recebe um **espelho** dos dados relevantes (leads, reuniões, oportunidades, casos) para a operação de vendas humana. | EspoCRM via API REST |

Direção conceitual do fluxo:

```
Visitante → Chat (Next.js) → POST /chat → Agente GMT (LangGraph)
                                              │
                                              ├─ escreve → Supabase (fonte de verdade interna)
                                              ├─ e-mail  → Resend
                                              ├─ agenda  → Google Calendar (push one-way)
                                              └─ [FUTURO] espelha → EspoCRM (API REST)
```

**Princípio-guia:** o Supabase permanece como fonte de verdade operacional do agente. O EspoCRM
é um **consumidor comercial** desses dados. Uma falha do EspoCRM **nunca** pode quebrar o
atendimento — o mesmo princípio já aplicado hoje ao Google Calendar e ao Resend.

---

## 2. Arquitetura atual do Agente GMT

Mapeamento dos componentes reais (arquivos em `backend/`):

### Backend / API HTTP — `backend/app/server/`
- **`webapp.py`** — entrypoint oficial do FastAPI. Contém:
  - `lifespan()`: abre `AsyncConnectionPool` (psycopg) sobre `SUPABASE_DB_URL`, cria o
    `AsyncPostgresSaver` (checkpointer LangGraph) via `checkpointer.setup()` e compila o agente
    com `build_agent(checkpointer)`.
  - Endpoints: `GET /health`, `GET /config`, `POST /chat`, `GET /stream` (SSE).
  - Middleware de segurança (`_security_headers`) e rate limiting por IP em memória
    (`_rate_limited`, `RATE_LIMIT_*`, `CHAT_INPUT_MAX_CHARS`).
  - Inclui o router administrativo: `app.include_router(admin_router)`.
- **`admin.py`** — endpoints **somente leitura** para o dashboard interno, protegidos por
  header `X-Admin-Token` (comparado com `ADMIN_API_TOKEN` via `hmac.compare_digest`):
  `GET /admin/summary`, `/admin/leads`, `/admin/reunioes`, `/admin/notificacoes`, `/admin/relatorios`.

### Agente / grafo — `backend/app/agent/`
- **`graph.py`** — ponte FastAPI ↔ grafo. Exporta:
  - `build_agent(checkpointer)` — compila o grafo com persistência.
  - `normalize_session_id()` — normaliza `session_id` em `thread_id` (prefixo `web:`).
  - `prepare_agent_input(text)` — converte texto em estado (`{"messages": [...]}`).
  - `format_agent_response(result)` — monta o payload de saída
    (`reply_text`, `intent`, `lead_id`, `structured`, `trace_id`).
- **`workflow.py`** — grafo principal (`StateGraph`). Nós reais:
  `parse_and_classify` → `prepare_plan` → `router` → `route_intent` → subgrafos
  (`leads_agent`, `duvidas_agent`, `orcamentos_agent`, `reunioes_agent`) e handlers
  (`handle_nutricao`, `handle_relatorio`) → `update_context` → (`execute_pending` | `respond_final`).
  Contém o dicionário **`AUTO_NOTIFY`** que dispara notificações automáticas por intent.
- **`tools.py`** — todas as **ferramentas** do agente e **todo o I/O com o Supabase**
  (INSERT/UPDATE). Conexão via `get_conn()` → `get_db_url()` → `SUPABASE_DB_URL`. Também concentra
  o envio de e-mail (Resend) e o pipeline de notificações.
- **`new_react.py`** — executor ReAct genérico usado pelos subgrafos.
- **`prompt.py`** — prompts (parser, planner, finalizador, ReAct por domínio) e a lista canônica
  de intents válidas.
- **`helpers.py`** — utilitários puros de estado/mensagens (`extract_text_content`,
  `ensure_context`, `get_lead_context`, `resolve`/`ref` helpers, `has_pending`, `push_ai_response`).

### RAG — `backend/app/rag/`
- `rag_tools.py` (busca híbrida `kb_search_gmt`), `ingest.py` (ingestão → `kb_docs`/`kb_chunks`),
  `loaders.py`, `duvida_rag_agent.py`. Somente leitura no fluxo de atendimento; escrita apenas na ingestão.

### Integrações externas — `backend/app/core/`
- **`gcal.py`** — Google Calendar em **push one-way** (visualização, não fonte de verdade).
  Autenticação por Service Account (`GOOGLE_SERVICE_ACCOUNT_JSON` / `GOOGLE_SERVICE_ACCOUNT_FILE`),
  `criar_evento_gcal(...)`. **É o padrão de referência para o EspoCRM.**

### E-mail — Resend (dentro de `tools.py`)
- `_enviar_email_resend()`, `_registrar_notificacao()`, `_ja_notificado()`, `_enviar_e_registrar()`.
  Envio idempotente (dedup por `tipo` + `referencia_id` + `destinatario`) com log em `notificacoes`.

### Persistência / memória
- Tabelas de negócio no schema `public` (ver seção 3).
- Checkpoints do LangGraph (`checkpoints`, `checkpoint_blobs`, `checkpoint_writes`,
  `checkpoint_migrations`) criados pelo `AsyncPostgresSaver`.

### Frontend / chat — `src/`
- `src/services/chatApi.ts` — chama `POST /chat` (`{ session_id, input }`) e `GET /config`.
- `src/types/chat.ts` — contrato TS de resposta (`ChatApiResponse`).
- `src/lib/dashboardApi.ts` — consumo **server-side** dos endpoints `/admin/*` com `X-Admin-Token`.

**Nota de acesso ao banco:** o backend conecta ao Postgres **diretamente** (role `postgres`)
via `SUPABASE_DB_URL`. Não usa a REST API do Supabase nem `ANON_KEY`/`SERVICE_ROLE_KEY`. Por isso
o backend faz *bypass* de RLS (ver seção 3 / migrations 000007 e 000008).

---

## 3. Contrato de dados atual (Supabase)

Schema canônico em `backend/supabase/migrations/`. Tabelas relevantes:

### `leads` — captação e gestão de leads
- **Finalidade:** leads captados pelo agente na landing page.
- **Campos principais:** `id (uuid PK)`, `nome (not null)`, `email`, `telefone`, `empresa`,
  `origem (default 'chat_site')`, `qualificado (bool)`, `score (0–100)`, `etapa_funil (text)`,
  `status_codigo (FK status_lead, default 'novo')`, `consentimento_lgpd`, `ultimo_contato_em`,
  `proxima_acao_em`, `criado_em`, `atualizado_em`.
- **Unicidade:** índice único `lower(email)` (`uq_leads_email`) e telefone normalizado
  (`uq_leads_phone_digits`). **A identidade é o e-mail.**
- **Quem escreve:** agente, via `tools.py`.
- **Tools/fluxo:** `cadastrar_lead`, `atualizar_lead`, `qualificar_lead`, `classificar_lead`
  (todas via `upsert_lead_identidade` / `resolve_lead_id_by_ref`).
- **Equivalente EspoCRM:** `Lead` (e/ou `Contact` quando qualificado).

### `reunioes` — agendamento
- **Finalidade:** reuniões agendadas com o lead. **Fonte de verdade dos horários ocupados.**
- **Campos principais:** `id`, `lead_id (FK)`, `data_hora (timestamptz)`,
  `tipo ('online'|'presencial')`, `local`, `status_codigo (FK status_reuniao, default 'agendada')`,
  `observacoes`, `lembrete_24h_enviado`, `lembrete_1h_enviado`, `criado_em`, `atualizado_em`,
  **`gcal_event_id`** (adicionado na migration 000004 — ID externo do Google Calendar).
- **Quem escreve:** agente, via `tools.py`.
- **Tools/fluxo:** `agendar_reuniao`, `remarcar_reuniao`, `cancelar_reuniao`
  (e `verificar_disponibilidade` para leitura de slots).
- **Equivalente EspoCRM:** `Meeting` (ou `Call`).

### `orcamentos` — propostas comerciais
- **Finalidade:** orçamentos gerados para um lead.
- **Campos principais:** `id`, `lead_id (FK, on delete cascade)`, `titulo`, `moeda (default 'EUR')`,
  `subtotal`, `desconto_pct (0–100)`, `total`, `corpo_md`,
  `status_codigo (FK status_orcamento, default 'rascunho')`, `criado_em`, `atualizado_em`.
- **Quem escreve:** agente, via `tools.py`.
- **Tools/fluxo:** `criar_orcamento`, `adicionar_item_orcamento`, `calcular_totais_orcamento`
  (`_recalc_orcamento`), `atualizar_corpo_orcamento`, `exportar_orcamento`.
- **Equivalente EspoCRM:** `Opportunity` (cabeçalho) e/ou `Quote`.

### `itens_orcamento` — linhas do orçamento (1:N)
- **Finalidade:** itens de serviço de um orçamento.
- **Campos principais:** `id`, `orcamento_id (FK cascade)`, `descricao`, `quantidade`,
  `preco_unitario`, `total`.
- **Quem escreve:** agente, via `adicionar_item_orcamento`.
- **Equivalente EspoCRM:** itens de `Quote` (Quote Items) ou linhas de produto da Opportunity.

### `duvidas` — atendimento RAG e escaladas
- **Finalidade:** histórico de perguntas do lead respondidas por RAG ou escaladas.
- **Campos principais:** `id`, `lead_id (FK, on delete set null)`, `pergunta`, `resposta`,
  `fonte`, `respondida_por_agente (bool)`, `escalada (bool)`, `motivo_escalada`, `criado_em`.
- **Quem escreve:** agente, via `responder_duvida_rag` e `escalar_duvida_humano`.
- **Equivalente EspoCRM:** `Case` (quando escalada) ou `Note` (histórico de dúvida respondida).

### `notificacoes` — log de e-mails enviados
- **Finalidade:** registro de todos os e-mails disparados (confirmações ao lead e alertas à equipe).
- **Campos principais:** `id`, `lead_id (FK set null)`, `tipo (enum check)`, `destinatario`,
  `assunto`, `referencia_id (uuid)`, `status_envio ('pendente'|'enviado'|'falhou'|'erro')`,
  `erro_mensagem`, `criado_em`, `enviado_em`.
- **Tipos válidos:** `confirmacao_cadastro`, `confirmacao_orcamento`, `confirmacao_reuniao`,
  `atualizacao_reuniao`, `lembrete_reuniao`, `nutricao`, `alerta_equipe_cadastro`,
  `alerta_equipe_orcamento`, `alerta_equipe_reuniao`, `alerta_equipe_escalada`, `relatorio_semanal`.
- **Quem escreve:** agente, via `_registrar_notificacao` (após tentativa de envio Resend).
- **Equivalente EspoCRM:** `Email` (log de atividade) ou `Activity`.

### `interacoes` — log de conversa (auditoria)
- **Finalidade:** log de todas as interações do agente (auditoria e métricas).
- **Campos principais:** `id`, `lead_id (FK set null)`, `sessao_id (text)`, `intent (not null)`,
  `mensagem_usuario`, `resposta_agente`, `tool_chamada`, `criado_em`.
- **Quem escreve:** ⚠️ **a tabela existe no schema, mas nenhum código em `backend/app/**` grava
  nela atualmente** (lacuna — ver seção 14).
- **Equivalente EspoCRM:** `Note`/`Stream` no registro do Lead (histórico de conversa), se desejado.

### `relatorios` — consolidação semanal
- **Finalidade:** métricas semanais (leads, reuniões, orçamentos, dúvidas).
- **Campos principais:** `id`, `periodo_inicio`, `periodo_fim`, `leads_novos`, `leads_qualificados`,
  `reunioes_agendadas`, `reunioes_concluidas`, `orcamentos_criados`, `orcamentos_aprovados`,
  `duvidas_total`, `duvidas_escaladas`, `taxa_resolucao`, `corpo_md`, `enviado`, `criado_em`.
- **Quem escreve:** agente, via `gerar_relatorio_semanal`.
- **Equivalente EspoCRM:** normalmente **não sincronizado** (métrica interna). Opcional: `Report`.

### Nutrição — `sequencias_nutricao` e `nutricao_leads`
- **`sequencias_nutricao`:** templates (`nome unique`, `total_etapas`, `ativa`). Seed:
  `boas_vindas`, `pos_orcamento`, `reengajamento`.
- **`nutricao_leads`:** inscrição de um lead numa sequência (`lead_id`, `sequencia_id`,
  `etapa_atual`, `status`, `proximo_envio_em`; unique `(lead_id, sequencia_id)`).
- **Quem escreve:** `iniciar_sequencia_nutricao`, `pausar_sequencia_nutricao`.
- **Equivalente EspoCRM:** `Campaign` / `Target List` (mapeamento opcional, fase avançada).

### `disponibilidade_config` — regras de agenda
- **Finalidade:** janelas de atendimento por dia da semana (fonte das regras de
  `verificar_disponibilidade`). `dia_semana (0=seg..6=dom)`, `hora_inicio`, `hora_fim`,
  `duracao_slot_min`, `fuso_horario (default Europe/Lisbon)`, `ativo`.
- **Equivalente EspoCRM:** sem equivalente direto (configuração interna). Não sincronizar.

### Tabelas de status / lookup (funil)
- **`status_lead`** (`codigo PK`, `rotulo`, `ordem`) — seed: `novo`, `em_contato`, `qualificado`,
  `proposta_enviada`, `fechado`, `perdido`.
- **`status_orcamento`** — `rascunho`, `enviado`, `aprovado`, `recusado`, `expirado`.
- **`status_reuniao`** — `agendada`, `remarcada`, `cancelada`, `concluida`.
- **Equivalente EspoCRM:** `Lead Status` / estágios de pipeline / status de Meeting/Opportunity.

### Segurança de acesso (contexto RLS)
- Migration **000007** (`security_lockdown`): `REVOKE ALL` de `anon`/`authenticated` nas tabelas
  de domínio, nas funções RAG e nos checkpoints; RLS nos checkpoints.
- Migration **000008** (`rls_governance`): RLS **ON + deny-by-default** (policies restritivas
  `... using (false)`) para `anon`/`authenticated` em todas as tabelas de domínio.
- **Impacto para a integração:** o EspoCRM **não** deve acessar o Postgres diretamente. O único
  caminho de escrita é o backend Python (role `postgres`, bypass RLS). A ponte com o EspoCRM é
  sempre a **API REST do EspoCRM**, chamada a partir do backend.

---

## 4. Mapeamento Supabase ↔ EspoCRM

| Supabase | EspoCRM | Direção do sync | Observações |
|---|---|---|---|
| `leads` | `Lead` (→ `Contact` ao qualificar) | GMT → Espo (push); Espo → GMT (webhook, opcional) | Identidade por e-mail. Converter Lead→Contact quando `qualificado=true` / `status_codigo` avançado. |
| `leads.status_codigo` | `Lead.status` / estágio de pipeline | GMT → Espo | Requer tabela de mapeamento de status (`novo`→`New`, `qualificado`→`Qualified`, etc.). |
| `reunioes` | `Meeting` (ou `Call`) | GMT → Espo (push) | Vincular ao Lead/Contact espelhado. `data_hora`, `tipo`, `local`, duração via `disponibilidade_config`. Segue o padrão `gcal_event_id`. |
| `orcamentos` | `Opportunity` (e/ou `Quote`) | GMT → Espo (push) | `total`, `moeda`, `status_codigo`→estágio. Decidir se vira Opportunity, Quote ou ambos (ver Perguntas pendentes). |
| `itens_orcamento` | Quote Items / linhas de produto | GMT → Espo (push, dependente) | Só se `orcamentos`→`Quote`. Sincronizar após o cabeçalho existir. |
| `duvidas` | `Case` (escalada) / `Note` (respondida) | GMT → Espo (push) | `escalada=true` → `Case`; dúvida respondida → `Note`/Stream no Lead. |
| `notificacoes` | `Email` / `Activity` (log) | GMT → Espo (push, opcional) | Espelhar como atividade de e-mail no registro do Lead. Volume alto — avaliar filtro por `tipo`. |
| `status_lead` (+ orçamento/reunião) | Lead Status / Pipeline Stages / status | Configuração (bootstrap) | Mapear enums uma vez; manter tabela de correspondência versionada. |
| `interacoes` | `Note`/Stream no Lead | GMT → Espo (opcional) | **Só após passar a ser gravada** no Supabase (lacuna atual). |
| `relatorios` | — (interno) | Não sincronizar | Métrica interna do agente. |
| `nutricao_leads` / `sequencias_nutricao` | `Campaign` / `Target List` | GMT → Espo (fase avançada) | Opcional; baixa prioridade. |
| `disponibilidade_config` | — | Não sincronizar | Configuração interna de agenda. |

Direções resumidas:
- **Push (GMT → EspoCRM):** caminho primário. O agente cria/atualiza registros comerciais.
- **Webhook (EspoCRM → GMT):** secundário/opcional. Ex.: vendedor humano altera status/estágio no
  EspoCRM e o GMT reflete em `leads.status_codigo`. Requer cuidado com laços de eco (ver seção 12).

---

## 5. Regra de identidade e deduplicação

A regra vive em **`backend/app/agent/tools.py`**, principalmente em `upsert_lead_identidade(...)`
e `resolve_lead_id_by_ref(...)`.

### Comportamento atual
1. **Prioridade por e-mail (fonte de verdade):** resolve o lead por `lower(email)`. Se existir,
   **atualiza** os campos informados; se não, tenta por telefone.
2. **Fallback por telefone:** compara `regexp_replace(telefone,'[^0-9]','','g')` (dígitos
   normalizados por `normalize_phone`).
3. **Nome nunca é chave:** o comentário do código é explícito — casar por nome reaproveitaria um
   lead homônimo antigo (com e-mail desatualizado). Nome só é usado como critério auxiliar/
   desambiguação em `resolve_lead_id_by_ref` (com preferência por correspondência **exata**).
4. **Criação exige** `nome` + (`email` **ou** `telefone`). A tabela reforça com
   `constraint chk_leads_contato` (`email is not null or telefone is not null`) e índices únicos
   `uq_leads_email` (por `lower(email)`) e `uq_leads_phone_digits`.

### Como refletir no EspoCRM
- A **chave de negócio** para deduplicação no EspoCRM deve ser o **e-mail** (secundário: telefone
  normalizado). Antes de criar um Lead/Contact, buscar por `emailAddress` via API REST.
- Preservar o vínculo persistindo o **ID externo** no Supabase (ver seção 8): assim a
  deduplicação futura é feita por `espo_lead_id`/`espo_contact_id` (chave forte) **com fallback**
  para e-mail (chave de negócio).
- Idempotência de sync = "existe `espo_*_id`? → `PUT`/update; senão → busca por e-mail → se achou,
  vincula; senão → `POST`/create".

### Campos externos necessários (mínimo)
- `leads.espo_lead_id`, `leads.espo_contact_id` (ver seção 8).
- Opcional: um `crm_sync_status` por registro, ou centralizar em outbox (recomendado, seção 8).

---

## 6. Pontos naturais de integração

Onde encaixar o sync sem quebrar o fluxo atual:

### A) Pós-tool em `tools.py` (dentro de cada tool)
- **Prós:** acesso direto ao resultado da escrita e ao `lead_id`/`reuniao_id` recém-criado.
- **Contras:** espalha lógica de CRM por muitas tools; acopla domínio a integração; difícil de
  desligar globalmente; risco de repetir código. Baixa coesão.

### B) `update_context` em `workflow.py` (nó único pós-execução) — **recomendado como gatilho**
- É onde o grafo já consolida `lead_atual` a partir de `tool_result` e onde `AUTO_NOTIFY` já
  dispara e-mails automáticos por intent. É o ponto natural para **enfileirar** um evento de sync.
- **Prós:** ponto único, já ciente de `intent` + `tool_result` + `lead_atual`; segue o padrão
  existente de efeitos colaterais (notificações); fácil de habilitar/desabilitar por flag.
- **Contras:** precisa mapear quais intents geram sync (análogo ao dict `AUTO_NOTIFY`).

### C) Endpoint webhook dedicado (EspoCRM → GMT)
- Necessário apenas para o fluxo **inverso** (mudanças feitas por humanos no CRM).
- **Prós:** habilita bidirecionalidade; desacoplado do turno de chat.
- **Contras:** superfície de segurança nova (assinatura/secret); risco de laço de eco.

### D) Outbox / fila de sincronização (tabela no Supabase) — **recomendado como mecanismo**
- `update_context` grava um evento em `crm_sync_outbox`; um worker/hook processa e chama a API do
  EspoCRM de forma assíncrona e com retry.
- **Prós:** desacopla o turno de chat da latência/falha do CRM; retry idempotente; auditável;
  não quebra o atendimento. Alinhado à filosofia "CRM é espelho".
- **Contras:** exige um worker (cron/loop) e uma migration de tabela.

### E) Padrão `gcal.py` (chamada direta best-effort dentro do fluxo)
- Como o Google Calendar hoje: chamar a API, capturar exceção, logar e seguir; gravar o ID externo
  se sucesso.
- **Prós:** simples; já provado no repo; zero infraestrutura extra.
- **Contras:** síncrono no turno (adiciona latência); sem retry automático em caso de falha.

**Recomendação:** **B (gatilho em `update_context`) + D (outbox com worker)**. Usar o padrão E
(`gcal.py`) como **modelo de resiliência** (best-effort, nunca derruba o fluxo) e, opcionalmente,
como implementação inicial da Fase 2/3 antes de introduzir o worker.

---

## 7. Estratégia recomendada de sync

Princípios:
- **Supabase = fonte de verdade operacional interna.** O agente sempre escreve primeiro no Supabase.
- **EspoCRM = espelho comercial.** Recebe os dados depois, de forma assíncrona.
- **Falha no EspoCRM não quebra o fluxo.** Exceções são logadas e reprocessadas (mesmo princípio
  já aplicado a `gcal.py` e ao envio Resend em `agendar_reuniao`).
- **Idempotência:** por `espo_*_id` (chave forte) com fallback por e-mail (chave de negócio).
- **ID externo:** persistido no Supabase seguindo o padrão real de `reunioes.gcal_event_id`.
- **Outbox + logs:** garantem retry e auditoria.

### Fluxo event-driven proposto
```
1. Intent detectada        (parse_and_classify / prepare_plan → router)
2. Tool escreve no Supabase (tools.py; fonte de verdade interna)
3. Evento de sync registrado (update_context enfileira em crm_sync_outbox — status 'pending')
4. Worker/hook lê o outbox e chama a API REST do EspoCRM (create/update idempotente)
5. EspoCRM retorna ID externo (espo_lead_id / espo_meeting_id / ...)
6. Supabase é atualizado com espo_*_id + outbox marcado 'done' (log em crm_sync_logs)
7. Em erro: incrementa tentativas, agenda retry/backoff, loga em crm_sync_logs;
   o atendimento continua normalmente (nunca lança para o turno de chat)
```

Ordenação de dependências (importante):
- `leads` deve sincronizar **antes** de `reunioes`/`orcamentos`/`duvidas` (que referenciam o lead).
- `itens_orcamento` **depois** de `orcamentos`. O outbox deve respeitar essa ordem (por
  `depends_on` ou por reprocessamento com backoff até a dependência existir).

---

## 8. Migrations futuras propostas

> **Proposta apenas** — não criar migrations executáveis nesta fase. Nomenclatura seguindo o
> padrão real do repo: prefixo datado sequencial (ex.: `20260101000009_...`), `create table if
> not exists`, `add column if not exists`, comentários `comment on ...`, idempotência.

### Colunas de vínculo externo (ID do EspoCRM)
| Coluna proposta | Tabela | Finalidade |
|---|---|---|
| `espo_lead_id` | `leads` | ID do Lead no EspoCRM (enquanto não convertido). |
| `espo_contact_id` | `leads` | ID do Contact no EspoCRM (após conversão de Lead qualificado). |
| `espo_meeting_id` | `reunioes` | ID do Meeting/Call no EspoCRM (espelha o padrão `gcal_event_id`). |
| `espo_opportunity_id` | `orcamentos` | ID da Opportunity no EspoCRM. |
| `espo_quote_id` | `orcamentos` | ID do Quote no EspoCRM (se orçamento virar Quote). |
| `espo_case_id` | `duvidas` | ID do Case no EspoCRM (para dúvidas escaladas). |

Todos `text`, `null` por padrão (null = ainda não sincronizado), com índice para lookup reverso
por webhook (ex.: `idx_leads_espo_lead_id`).

### Tabela de outbox — `crm_sync_outbox`
- **Finalidade:** fila durável de eventos de sync a serem enviados ao EspoCRM.
- Campos sugeridos: `id (uuid)`, `aggregate_type (text: 'lead'|'reuniao'|'orcamento'|'duvida'|...)`,
  `aggregate_id (uuid)`, `op (text: 'create'|'update'|'delete')`, `payload (jsonb)`,
  `status (text: 'pending'|'processing'|'done'|'error')`, `attempts (int)`, `next_attempt_at
  (timestamptz)`, `last_error (text)`, `depends_on (uuid null)`, `criado_em`, `atualizado_em`.

### Tabela de logs — `crm_sync_logs`
- **Finalidade:** auditoria de cada tentativa de sync (request/response resumido, status HTTP, erro).
- Campos sugeridos: `id (uuid)`, `outbox_id (uuid FK)`, `direction (text: 'push'|'webhook')`,
  `entity (text)`, `espo_id (text null)`, `http_status (int null)`, `success (bool)`,
  `error_message (text null)`, `duration_ms (int null)`, `criado_em`.

Todas as tabelas novas devem entrar no bloco de `REVOKE`/RLS deny-by-default (migrations 000007/
000008) para manter o padrão de segurança (acesso só pelo backend `postgres`).

---

## 9. Estrutura de pastas futura

Alinhada ao padrão real (`backend/app/core/gcal.py` para integrações externas; `backend/app/
agent/tools.py` para tools). Proposta:

```
backend/app/integrations/espo/
├── __init__.py
├── client.py      # cliente HTTP da API REST do EspoCRM (sessão, base URL, timeouts, retries)
├── auth.py        # autenticação (API Key em header X-Api-Key, ou usuário/senha) e montagem de headers
├── schemas.py     # modelos Pydantic dos payloads EspoCRM (Lead, Contact, Meeting, Opportunity, Case)
├── mapper.py      # tradução Supabase ↔ EspoCRM (campos, enums de status, e-mail/telefone)
├── sync.py        # orquestração: lê crm_sync_outbox, chama client, grava espo_*_id, escreve logs
├── webhooks.py    # parsing/validação de webhooks EspoCRM → GMT (assinatura, anti-eco)
└── errors.py      # exceções tipadas (EspoAuthError, EspoRateLimitError, EspoConflictError, ...)
```

Complementos (fora de `integrations/espo/`, seguindo o repo):
- **Gatilho:** pequena função de enfileiramento chamada por `update_context` em
  `backend/app/agent/workflow.py` (análoga ao `AUTO_NOTIFY`), que apenas insere no outbox.
- **Worker:** `backend/app/integrations/espo/worker.py` **ou** um script em `backend/scripts/`
  (ex.: `run_espo_sync.py`) acionado por cron/loop — coerente com `backend/scripts/` existente.
- **Endpoints:** rotas de webhook/admin em `backend/app/server/` (ver seção 11).

Responsabilidades:
- `client.py` — única porta de saída HTTP; encapsula base URL, headers e política de retry/backoff.
- `auth.py` — resolve credenciais das envs (seção 10); nunca loga segredos.
- `schemas.py` — valida forma dos dados enviados/recebidos; isola mudanças de schema do EspoCRM.
- `mapper.py` — regras de negócio de tradução (status→estágio, lead→contact, moeda, e-mail chave).
- `sync.py` — idempotência, ordem de dependências, atualização de `espo_*_id`, gravação de logs.
- `webhooks.py` — segurança de entrada e prevenção de laço de eco.
- `errors.py` — classificação de falhas para decidir retry vs. descarte.

---

## 10. Variáveis de ambiente futuras

> Propostas com base no estilo do `backend/.env.example` (comentário + chave vazia; sem segredos).

```dotenv
# --- EspoCRM (CRM comercial — API REST; futura integração) ---
# Base URL da instância EspoCRM (sem barra final). Ex.: https://crm.suaempresa.com
ESPOCRM_BASE_URL=
# Autenticação por API Key (recomendado — header X-Api-Key de um usuário API do EspoCRM):
ESPOCRM_API_KEY=
# Alternativa por usuário/senha (Basic Auth) — usar só se API Key não for viável:
# ESPOCRM_USERNAME=
# ESPOCRM_PASSWORD=
# Segredo para validar webhooks EspoCRM → GMT (assinatura HMAC do payload):
ESPOCRM_WEBHOOK_SECRET=
# Liga/desliga a sincronização globalmente (default false até estar pronto):
ESPOCRM_SYNC_ENABLED=false
# Modo simulação: monta e loga os payloads, mas NÃO chama a API do EspoCRM:
ESPOCRM_SYNC_DRY_RUN=true
```

Notas:
- Seguir o padrão atual: variáveis lidas via `os.getenv(...)` (como `SUPABASE_DB_URL`,
  `RESEND_API_KEY`, `ADMIN_API_TOKEN`).
- Em produção (Render), replicar as variáveis no painel do serviço (como já indicado no
  `.env.example` para as demais chaves).
- Nunca commitar valores reais.

---

## 11. Endpoints futuros necessários

Seguindo o padrão do backend (FastAPI em `webapp.py`; admin protegido por `X-Admin-Token` via
`require_admin` em `admin.py`):

| Endpoint proposto | Método | Proteção | Finalidade |
|---|---|---|---|
| `/webhooks/espocrm` | `POST` | `ESPOCRM_WEBHOOK_SECRET` (assinatura HMAC) | Recebe eventos EspoCRM → GMT (ex.: mudança de status pelo vendedor). |
| `/admin/sync/espocrm/retry` | `POST` | `X-Admin-Token` (`require_admin`) | Reprocessa itens do outbox em `error` (retry manual). |
| `/admin/sync/espocrm/status` | `GET` | `X-Admin-Token` (`require_admin`) | Estado do outbox: pendentes, erros, últimos logs. |

Observações:
- O webhook fica **fora** de `/admin/*` (chamado por sistema externo, autenticado por secret).
- Os endpoints de sync entram no `admin_router` existente, reaproveitando `require_admin`.
- Rate limiting e headers de segurança já existentes em `webapp.py` aplicam-se automaticamente.

---

## 12. Riscos técnicos

- **Duplicação de lead:** criar no EspoCRM antes de checar e-mail/`espo_lead_id`. Mitigar com
  busca por e-mail + idempotência por ID externo.
- **Conflito Supabase ↔ EspoCRM:** edições concorrentes (agente vs. vendedor humano). Definir
  precedência por campo (ex.: status pode ser "dono" do EspoCRM; dados de contato "dono" do GMT).
- **Retry duplicado:** reenvio após timeout que na verdade teve sucesso. Mitigar com idempotência
  (buscar por e-mail/ID antes de criar) e chave de idempotência por evento do outbox.
- **Mudança de schema no EspoCRM:** campos custom renomeados/removidos. Isolar em `schemas.py` +
  `mapper.py`; falhas de validação viram erro de sync (retry/log), não quebra de fluxo.
- **Credenciais:** vazamento de API Key/secret. Nunca logar; carregar só via env; rotacionar.
- **Latência:** chamadas síncronas ao CRM aumentam o tempo de resposta do chat. Mitigar com
  outbox assíncrono (seção 7).
- **Falha do CRM durante a conversa:** indisponibilidade do EspoCRM não pode afetar o atendimento.
  Mitigar com best-effort + outbox (padrão `gcal.py`).
- **Laço de eco (webhook):** GMT escreve no Espo → Espo dispara webhook → GMT reescreve → ... .
  Mitigar marcando origem da mudança e ignorando webhooks originados pelo próprio sync.
- **Acoplamento excessivo:** lógica de CRM infiltrada nas tools de domínio. Mitigar concentrando
  tudo em `integrations/espo/` e usando um único gatilho em `update_context`.

---

## 13. Decisões recomendadas

- **Usar a API REST do EspoCRM**, nunca acesso direto ao MariaDB do CRM.
- **Supabase permanece como fonte de verdade operacional interna** do agente.
- **EspoCRM é o CRM comercial** (espelho para a operação de vendas humana).
- **Sync assíncrono** sempre que possível (outbox + worker); best-effort quando síncrono.
- **Idempotência** por `espo_*_id` (chave forte) com fallback por **e-mail** (chave de negócio).
- **Nunca quebrar a conversa** se o CRM falhar (logar + retry, seguindo o padrão de `gcal.py`).
- **ID externo persistido no Supabase** seguindo o padrão real `reunioes.gcal_event_id`.
- **Tudo isolado em `backend/app/integrations/espo/`**, com um único gatilho em `update_context`.
- **Novas tabelas entram no regime de RLS deny-by-default** (migrations 000007/000008).

---

## 14. Lacunas atuais encontradas

Objetivamente, o que **ainda não existe** no repositório hoje:

- **Colunas `espo_*_id`** — só existe `reunioes.gcal_event_id`; nenhum vínculo com EspoCRM.
- **Outbox/fila de sync** — não há `crm_sync_outbox` nem `crm_sync_logs`.
- **Webhook EspoCRM** — não há endpoint `/webhooks/espocrm` nem validação de assinatura.
- **Client EspoCRM** — não existe `backend/app/integrations/` (pasta inexistente); nenhum cliente HTTP.
- **Gravação em `interacoes`** — a tabela existe no schema, mas **nenhum código grava** nela
  (o log de conversa/auditoria não está sendo populado).
- **Worker/cron de sync** — não há processador assíncrono; o padrão atual (`gcal.py`, Resend) é
  best-effort síncrono dentro da tool.
- **Mapeamento de status** — não há tabela/dicionário de correspondência entre `status_lead`
  (e demais status) e os estágios/status do EspoCRM.
- **Formulário de contacto do site** (`src/components/ui/ContactForm.tsx`) — ainda é mock
  (`console.log`), não persiste no Supabase; portanto não gera lead nem sync hoje.

---

## 15. Plano de execução sugerido

### Fase 0 — Documentação e decisões
- **Entregáveis:** este documento; respostas às "Perguntas pendentes"; decisão orçamento→
  Opportunity/Quote; tabela de mapeamento de status; escolha de auth (API Key vs. user/senha).
- **Critério de aceite:** decisões registradas e aprovadas; escopo de entidades do MVP definido.

### Fase 1 — Migrations de vínculo externo
- **Entregáveis:** migration com `espo_*_id` (seção 8) + `crm_sync_outbox` + `crm_sync_logs`;
  inclusão dessas tabelas no REVOKE/RLS deny-by-default.
- **Critério de aceite:** migrations idempotentes aplicam sem erro; RLS confirmado; backend
  continua escrevendo normalmente (bypass RLS).

### Fase 2 — Client EspoCRM em modo dry-run
- **Entregáveis:** `integrations/espo/{client,auth,schemas,mapper,errors}.py`; envs da seção 10;
  `ESPOCRM_SYNC_DRY_RUN=true` monta e loga payloads sem enviar.
- **Critério de aceite:** payloads válidos gerados a partir de registros reais do Supabase e
  logados; nenhuma chamada real ao CRM; segredos não aparecem em log.

### Fase 3 — Sync Lead/Contact
- **Entregáveis:** gatilho em `update_context` enfileira eventos de `leads`; `sync.py` processa o
  outbox (create/update idempotente por e-mail); grava `espo_lead_id`/`espo_contact_id`.
- **Critério de aceite:** cadastrar/atualizar/qualificar lead reflete no EspoCRM sem duplicar;
  reexecução é idempotente; falha do CRM não quebra o chat (evento fica `error` + retry).

### Fase 4 — Sync Reuniões
- **Entregáveis:** sync de `reunioes` → `Meeting/Call`, vinculado ao lead espelhado; grava
  `espo_meeting_id`; respeita dependência (lead antes da reunião).
- **Critério de aceite:** agendar/remarcar/cancelar reflete no EspoCRM; coerência com
  `gcal_event_id`; idempotente.

### Fase 5 — Sync Orçamentos/Oportunidades
- **Entregáveis:** sync de `orcamentos` (→ Opportunity e/ou Quote) e, se aplicável,
  `itens_orcamento`; grava `espo_opportunity_id`/`espo_quote_id`.
- **Critério de aceite:** criar/atualizar orçamento reflete no CRM com itens e totais corretos;
  mapeamento de status de orçamento validado; idempotente.

### Fase 6 — Webhooks EspoCRM → GMT
- **Entregáveis:** `POST /webhooks/espocrm` com validação por `ESPOCRM_WEBHOOK_SECRET`;
  `webhooks.py` com anti-eco; atualização de `leads.status_codigo` a partir do CRM.
- **Critério de aceite:** mudança de status no EspoCRM reflete no Supabase sem laço de eco;
  payloads inválidos/assinatura errada são rejeitados.

### Fase 7 — Admin/status/retry
- **Entregáveis:** `GET /admin/sync/espocrm/status` e `POST /admin/sync/espocrm/retry`
  (protegidos por `require_admin`); visão do outbox/logs no dashboard interno.
- **Critério de aceite:** operador enxerga pendências/erros e reprocessa manualmente.

### Fase 8 — Testes e hardening
- **Entregáveis:** testes de `mapper`/`sync`/idempotência (seguindo `backend/tests/`); simulação
  de falha do CRM; backoff/retry; documentação operacional; ativação gradual via
  `ESPOCRM_SYNC_ENABLED`.
- **Critério de aceite:** suíte verde; falhas do CRM comprovadamente não afetam o atendimento;
  rollout controlado por flag.

---

## Perguntas pendentes para validação humana

1. **Orçamento → o quê no EspoCRM?** `Opportunity`, `Quote`, ou ambos? Isso define se precisamos de
   `espo_opportunity_id`, `espo_quote_id` ou os dois, e como tratar `itens_orcamento`.
2. **Lead vs. Contact:** em que momento um `leads` do Supabase vira `Contact` no EspoCRM? No
   `qualificado=true`? Num `status_codigo` específico (`qualificado`/`proposta_enviada`)?
3. **Mapa de status:** qual a correspondência exata entre `status_lead`
   (`novo`/`em_contato`/`qualificado`/`proposta_enviada`/`fechado`/`perdido`) e os estágios do
   pipeline do EspoCRM? Idem para `status_orcamento` e `status_reuniao`.
4. **Direção do sync de status:** quem é o "dono" do status? GMT, EspoCRM, ou depende do campo?
   Precisamos do fluxo inverso (webhook) já no MVP?
5. **Autenticação:** usar **API Key** (usuário API dedicado no EspoCRM) ou usuário/senha? Há um
   usuário API disponível e com quais permissões (ACL por entidade)?
6. **Volume de `notificacoes`:** espelhar todos os e-mails como Activity/Email no EspoCRM pode
   gerar ruído. Sincronizar todos, um subconjunto por `tipo`, ou nenhum?
7. **`duvidas`:** dúvida escalada vira `Case`? E dúvida respondida por RAG — vira `Note`/Stream ou
   fica só no Supabase?
8. **`interacoes`:** devemos passar a gravar o log de conversa no Supabase (lacuna atual) e depois
   espelhar no EspoCRM, ou manter fora do CRM?
9. **Campos custom no EspoCRM:** haverá campos personalizados (ex.: `origem`, `score`,
   `consentimento_lgpd`, `gmt_lead_id`) para armazenar dados do GMT do lado do CRM?
10. **Nutrição:** `sequencias_nutricao`/`nutricao_leads` devem virar `Campaign`/`Target List` no
    EspoCRM, ou ficam exclusivamente no GMT?
11. **Instância EspoCRM:** self-hosted ou cloud? Há limites de rate limit da API a considerar no
    worker/retry?
12. **Formulário de contacto do site:** ele será ativado para persistir leads (hoje é mock)? Se
    sim, entra como mais uma origem de sync (`origem='formulario'`).


---

## Respostas do desenvolvedor

---

## 1. Orçamento → Opportunity, Quote ou ambos?

**Resposta:** Ambos.

**Decisão:** O orçamento gera uma `Opportunity` e um `Quote`. Os itens do orçamento pertencem ao `Quote`.

**Implementação:**

* `espo_opportunity_id`
* `espo_quote_id`

---

## 2. Lead vs. Contact

**Resposta:** Converter para `Contact` quando o lead for **qualificado**.

**Gatilho:**

```text
status_codigo = qualificado
```

ou

```text
qualificado = true
```

Esse será o único gatilho de conversão.

---

## 3. Mapa de status

### Lead

| GMT              | EspoCRM     |
| ---------------- | ----------- |
| novo             | New         |
| em_contato       | Contacted   |
| qualificado      | Qualified   |
| proposta_enviada | Proposal    |
| fechado          | Closed Won  |
| perdido          | Closed Lost |

### Orçamento

| GMT      | EspoCRM  |
| -------- | -------- |
| rascunho | Draft    |
| enviado  | Sent     |
| aprovado | Accepted |
| recusado | Rejected |
| expirado | Expired  |

### Reunião

| GMT       | EspoCRM  |
| --------- | -------- |
| agendada  | Planned  |
| remarcada | Planned  |
| concluida | Held     |
| cancelada | Not Held |

---

## 4. Direção do sync de status

**Resposta:** Sincronização bidirecional, com autoridade por campo.

**Decisão:**

* EspoCRM é autoridade sobre o **pipeline comercial**.
* GMT é autoridade sobre **conversa, IA, score, contexto e memória**.
* Alterações comerciais feitas no EspoCRM retornam ao GMT via **webhook**.
* O agente nunca sobrescreve diretamente o status comercial definido pelo CRM.

---

## 5. Autenticação

**Resposta:** API Key.

**Decisão:**

Criar um usuário técnico exclusivo:

```text
gmt-integration
```

com permissões apenas nas entidades sincronizadas.

---

## 6. Notificações

**Resposta:** Sincronizar apenas notificações comerciais.

**Sincronizar:**

* proposta enviada
* confirmação de reunião
* negociações
* atividades comerciais relevantes

Demais notificações permanecem apenas no Supabase.

---

## 7. Dúvidas

**Resposta:**

* dúvida escalada → `Case`
* dúvida respondida pelo RAG → permanece apenas no Supabase

---

## 8. Interações

**Resposta:** Sim.

Gravar todas as interações no Supabase.

No EspoCRM sincronizar apenas:

* resumo da conversa
* última interação
* observações relevantes

> **Gravar todas as interações no Supabase passa a ser um requisito do MVP. O EspoCRM receberá apenas um resumo e as informações comercialmente relevantes.**

---

## 9. Campos customizados

**Resposta:** Sim.

Criar no mínimo:

```text
gmt_lead_id
origem
score
consentimento_lgpd
ultima_interacao
ultima_sincronizacao
```

---

## 10. Nutrição

**Resposta:** Permanece no GMT.

O EspoCRM apenas recebe informações comerciais quando necessário.

---

## 11. Instância

**Resposta:** Self-hosted.

Implementar:

* retry
* exponential backoff
* fila (outbox)

---

## 12. Formulário do site

**Resposta:** Sim.

O formulário passa a gerar Leads normalmente.

Adicionar a origem:

```text
origem = formulario
```

seguindo o mesmo fluxo utilizado pelo chatbot.

---

