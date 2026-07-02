-- Agente GMT — Esquema Landing Page (clean schema)
-- Mapeado 1:1 com o Cheat Sheet de Intents do Agente GMT
-- Requisitos: Postgres ≥ 14 com extensão pgcrypto (Supabase já inclui)

create extension if not exists "pgcrypto";

-- ════════════════════════════════════════════════════════════════════
-- LOOKUP TABLES (referência)
-- ════════════════════════════════════════════════════════════════════

-- Status do lead no funil
create table if not exists public.status_lead (
  codigo text primary key,
  rotulo text not null,
  ordem smallint not null default 0,
  criado_em timestamptz not null default now()
);

comment on table public.status_lead is 'Lookup de status do lead no funil (tabela de referência).';
comment on column public.status_lead.codigo is 'Código do status (PK): novo, em_contato, qualificado, proposta_enviada, fechado, perdido.';
comment on column public.status_lead.rotulo is 'Rótulo amigável do status.';
comment on column public.status_lead.ordem is 'Ordem no funil (para ordenação lógica).';

-- Seed: status iniciais do funil GMT
insert into public.status_lead (codigo, rotulo, ordem) values
  ('novo',              'Novo',              1),
  ('em_contato',        'Em contato',        2),
  ('qualificado',       'Qualificado',       3),
  ('proposta_enviada',  'Proposta enviada',  4),
  ('fechado',           'Fechado (ganho)',    5),
  ('perdido',           'Perdido',           6)
on conflict (codigo) do nothing;

-- Status do orçamento
create table if not exists public.status_orcamento (
  codigo text primary key,
  rotulo text not null,
  criado_em timestamptz not null default now()
);

comment on table public.status_orcamento is 'Lookup de status de orçamento.';

insert into public.status_orcamento (codigo, rotulo) values
  ('rascunho',  'Rascunho'),
  ('enviado',   'Enviado ao lead'),
  ('aprovado',  'Aprovado'),
  ('recusado',  'Recusado'),
  ('expirado',  'Expirado')
on conflict (codigo) do nothing;

-- Status da reunião
create table if not exists public.status_reuniao (
  codigo text primary key,
  rotulo text not null,
  criado_em timestamptz not null default now()
);

comment on table public.status_reuniao is 'Lookup de status de reunião.';

insert into public.status_reuniao (codigo, rotulo) values
  ('agendada',   'Agendada'),
  ('remarcada',  'Remarcada'),
  ('cancelada',  'Cancelada'),
  ('concluida',  'Concluída')
on conflict (codigo) do nothing;

-- ════════════════════════════════════════════════════════════════════
-- LEADS
-- Intents: lead_cadastrar, lead_obter, lead_buscar, lead_listar,
--          lead_atualizar, lead_qualificar, lead_classificar
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  nome text not null,
  email text,
  telefone text,
  empresa text,
  origem text default 'chat_site',
  qualificado boolean not null default false,
  score smallint default 0 check (score >= 0 and score <= 100),
  etapa_funil text,
  status_codigo text not null references public.status_lead(codigo) default 'novo',
  consentimento_lgpd boolean not null default false,
  ultimo_contato_em timestamptz,
  proxima_acao_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  constraint chk_leads_contato check (email is not null or telefone is not null)
);

comment on table public.leads is 'Leads captados na landing page GMT pelo agente.';
comment on column public.leads.id is 'Identificador único do lead (UUID).';
comment on column public.leads.nome is 'Nome do lead.';
comment on column public.leads.email is 'E-mail do lead.';
comment on column public.leads.telefone is 'Telefone/WhatsApp do lead (formato livre).';
comment on column public.leads.empresa is 'Empresa do lead (quando aplicável).';
comment on column public.leads.origem is 'Origem do lead: chat_site, formulario, campanha, indicacao.';
comment on column public.leads.qualificado is 'Indica se o lead foi qualificado pelo agente (lead_qualificar).';
comment on column public.leads.score is 'Score de qualificação (0–100).';
comment on column public.leads.etapa_funil is 'Etapa atual no funil de vendas (texto livre complementar ao status).';
comment on column public.leads.status_codigo is 'Status do lead no funil (FK para status_lead.codigo).';
comment on column public.leads.consentimento_lgpd is 'Consentimento LGPD/RGPD para uso dos dados.';
comment on column public.leads.ultimo_contato_em is 'Data/hora do último contato.';
comment on column public.leads.proxima_acao_em is 'Data/hora da próxima ação planejada.';
comment on column public.leads.criado_em is 'Timestamp de criação.';
comment on column public.leads.atualizado_em is 'Timestamp da última atualização.';

-- Unicidade case-insensitive de email
do $$ begin
  if not exists (
    select 1 from pg_indexes where schemaname = 'public' and indexname = 'uq_leads_email'
  ) then
    execute 'create unique index uq_leads_email on public.leads (lower(email)) where email is not null';
  end if;
end $$;

-- Índices de busca
do $$ begin
  if not exists (
    select 1 from pg_indexes where schemaname = 'public' and indexname = 'idx_leads_nome_lower'
  ) then
    execute 'create index idx_leads_nome_lower on public.leads (lower(nome))';
  end if;
  if not exists (
    select 1 from pg_indexes where schemaname = 'public' and indexname = 'idx_leads_empresa_lower'
  ) then
    execute 'create index idx_leads_empresa_lower on public.leads (lower(empresa))';
  end if;
end $$;

create index if not exists idx_leads_status_codigo on public.leads (status_codigo);
create index if not exists idx_leads_criado_em on public.leads (criado_em desc);
create index if not exists idx_leads_qualificado on public.leads (qualificado) where qualificado = true;

-- Unicidade de telefone normalizado
create unique index if not exists uq_leads_phone_digits
  on public.leads ((regexp_replace(telefone, '[^0-9]', '', 'g'))) where telefone is not null;

-- ════════════════════════════════════════════════════════════════════
-- DÚVIDAS / ATENDIMENTO RAG
-- Intents: duvida_responder, duvida_escalar
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.duvidas (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  pergunta text not null,
  resposta text,
  fonte text,
  respondida_por_agente boolean not null default true,
  escalada boolean not null default false,
  motivo_escalada text,
  criado_em timestamptz not null default now()
);

comment on table public.duvidas is 'Perguntas feitas pelo lead ao agente GMT (histórico RAG/FAQ).';
comment on column public.duvidas.id is 'Identificador da dúvida (UUID).';
comment on column public.duvidas.lead_id is 'Lead associado (FK, null se ainda anônimo).';
comment on column public.duvidas.pergunta is 'Pergunta feita pelo lead.';
comment on column public.duvidas.resposta is 'Resposta dada pelo agente.';
comment on column public.duvidas.fonte is 'Fonte RAG utilizada (ex.: Produto_Conteudo, Institucional_Conteudo).';
comment on column public.duvidas.respondida_por_agente is 'Se o agente conseguiu responder automaticamente.';
comment on column public.duvidas.escalada is 'Se a dúvida foi escalada para atendimento humano.';
comment on column public.duvidas.motivo_escalada is 'Motivo da escalada (quando aplicável).';
comment on column public.duvidas.criado_em is 'Timestamp de criação.';

create index if not exists idx_duvidas_lead_id on public.duvidas (lead_id);
create index if not exists idx_duvidas_escalada on public.duvidas (escalada) where escalada = true;
create index if not exists idx_duvidas_criado_em on public.duvidas (criado_em desc);

-- ════════════════════════════════════════════════════════════════════
-- ORÇAMENTOS
-- Intents: orcamento_criar, orcamento_adicionar_item,
--          orcamento_calcular_totais, orcamento_atualizar_corpo,
--          orcamento_listar, orcamento_exportar
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.orcamentos (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  titulo text not null,
  moeda text not null default 'EUR',
  subtotal numeric(12,2) not null default 0,
  desconto_pct numeric(5,2) not null default 0 check (desconto_pct >= 0 and desconto_pct <= 100),
  total numeric(12,2) not null default 0,
  corpo_md text,
  status_codigo text not null references public.status_orcamento(codigo) default 'rascunho',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table public.orcamentos is 'Orçamentos comerciais gerados pelo agente GMT para um lead.';
comment on column public.orcamentos.id is 'Identificador do orçamento (UUID).';
comment on column public.orcamentos.lead_id is 'Lead associado (FK).';
comment on column public.orcamentos.titulo is 'Título do orçamento.';
comment on column public.orcamentos.moeda is 'Moeda (padrão EUR — Portugal).';
comment on column public.orcamentos.subtotal is 'Soma dos itens antes de descontos.';
comment on column public.orcamentos.desconto_pct is 'Desconto percentual aplicado (0–100).';
comment on column public.orcamentos.total is 'Valor total após desconto.';
comment on column public.orcamentos.corpo_md is 'Escopo/corpo do orçamento em Markdown.';
comment on column public.orcamentos.status_codigo is 'Status do orçamento (FK para status_orcamento.codigo).';
comment on column public.orcamentos.criado_em is 'Timestamp de criação.';
comment on column public.orcamentos.atualizado_em is 'Timestamp de atualização.';

create index if not exists idx_orcamentos_lead_id on public.orcamentos (lead_id);
create index if not exists idx_orcamentos_status on public.orcamentos (status_codigo);

-- Itens de orçamento (1:N)
create table if not exists public.itens_orcamento (
  id uuid primary key default gen_random_uuid(),
  orcamento_id uuid not null references public.orcamentos(id) on delete cascade,
  descricao text not null,
  quantidade numeric(12,2) not null check (quantidade >= 0),
  preco_unitario numeric(12,2) not null check (preco_unitario >= 0),
  total numeric(12,2) not null
);

comment on table public.itens_orcamento is 'Itens de um orçamento (serviços GMT: sites, tráfego, chatbots etc.).';
comment on column public.itens_orcamento.id is 'Identificador do item (UUID).';
comment on column public.itens_orcamento.orcamento_id is 'Orçamento associado (FK).';
comment on column public.itens_orcamento.descricao is 'Descrição do serviço/produto.';
comment on column public.itens_orcamento.quantidade is 'Quantidade.';
comment on column public.itens_orcamento.preco_unitario is 'Preço unitário.';
comment on column public.itens_orcamento.total is 'Total do item (quantidade × preço).';

create index if not exists idx_itens_orcamento_orcamento_id on public.itens_orcamento (orcamento_id);

-- ════════════════════════════════════════════════════════════════════
-- REUNIÕES (agendamento)
-- Intents: reuniao_verificar_agenda, reuniao_agendar, reuniao_remarcar,
--          reuniao_cancelar, reuniao_listar, reuniao_lembrete
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.reunioes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  data_hora timestamptz not null,
  tipo text not null default 'online' check (tipo in ('presencial','online')),
  local text,
  status_codigo text not null references public.status_reuniao(codigo) default 'agendada',
  observacoes text,
  lembrete_24h_enviado boolean not null default false,
  lembrete_1h_enviado boolean not null default false,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

comment on table public.reunioes is 'Reuniões agendadas pelo agente GMT com o lead.';
comment on column public.reunioes.id is 'Identificador da reunião (UUID).';
comment on column public.reunioes.lead_id is 'Lead associado (FK).';
comment on column public.reunioes.data_hora is 'Data/hora agendada.';
comment on column public.reunioes.tipo is 'Tipo: presencial ou online.';
comment on column public.reunioes.local is 'Local da reunião (endereço ou link de videochamada).';
comment on column public.reunioes.status_codigo is 'Status da reunião (FK para status_reuniao.codigo).';
comment on column public.reunioes.observacoes is 'Observações adicionais.';
comment on column public.reunioes.lembrete_24h_enviado is 'Se o lembrete de 24h foi enviado.';
comment on column public.reunioes.lembrete_1h_enviado is 'Se o lembrete de 1h foi enviado.';
comment on column public.reunioes.criado_em is 'Timestamp de criação.';
comment on column public.reunioes.atualizado_em is 'Timestamp de atualização.';

create index if not exists idx_reunioes_lead_id on public.reunioes (lead_id);
create index if not exists idx_reunioes_data_hora on public.reunioes (data_hora);
create index if not exists idx_reunioes_status on public.reunioes (status_codigo);
create index if not exists idx_reunioes_lembretes_pendentes on public.reunioes (data_hora)
  where (lembrete_24h_enviado = false or lembrete_1h_enviado = false)
    and status_codigo = 'agendada';

-- ════════════════════════════════════════════════════════════════════
-- NUTRIÇÃO POR E-MAIL
-- Intents: nutricao_iniciar, nutricao_pausar, nutricao_status
-- ════════════════════════════════════════════════════════════════════

-- Sequências disponíveis (template)
create table if not exists public.sequencias_nutricao (
  id uuid primary key default gen_random_uuid(),
  nome text not null unique,
  descricao text,
  total_etapas smallint not null default 0,
  ativa boolean not null default true,
  criado_em timestamptz not null default now()
);

comment on table public.sequencias_nutricao is 'Templates de sequências de nutrição por e-mail (boas-vindas, conteúdo, oferta).';
comment on column public.sequencias_nutricao.nome is 'Nome da sequência (ex.: boas_vindas, pos_orcamento).';
comment on column public.sequencias_nutricao.total_etapas is 'Número total de etapas/e-mails na sequência.';

insert into public.sequencias_nutricao (nome, descricao, total_etapas) values
  ('boas_vindas',    'Sequência de boas-vindas para novos leads',  3),
  ('pos_orcamento',  'Follow-up após envio de orçamento',          4),
  ('reengajamento',  'Reativação de leads inativos',               3)
on conflict (nome) do nothing;

-- Inscrições de leads em sequências
create table if not exists public.nutricao_leads (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid not null references public.leads(id) on delete cascade,
  sequencia_id uuid not null references public.sequencias_nutricao(id) on delete cascade,
  etapa_atual smallint not null default 1,
  status text not null default 'ativa' check (status in ('ativa','pausada','concluida','cancelada')),
  proximo_envio_em timestamptz,
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now(),

  constraint uq_nutricao_lead_seq unique (lead_id, sequencia_id)
);

comment on table public.nutricao_leads is 'Inscrição de um lead em uma sequência de nutrição.';
comment on column public.nutricao_leads.etapa_atual is 'Etapa atual do lead nesta sequência (1-indexed).';
comment on column public.nutricao_leads.status is 'Status: ativa, pausada, concluida, cancelada.';
comment on column public.nutricao_leads.proximo_envio_em is 'Data/hora do próximo e-mail programado.';

create index if not exists idx_nutricao_leads_lead_id on public.nutricao_leads (lead_id);
create index if not exists idx_nutricao_leads_proximo on public.nutricao_leads (proximo_envio_em)
  where status = 'ativa';

-- ════════════════════════════════════════════════════════════════════
-- NOTIFICAÇÕES (e-mails enviados)
-- Intents: email_confirmar_lead, email_notificar_equipe
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.notificacoes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  tipo text not null check (tipo in (
    'confirmacao_cadastro',
    'confirmacao_orcamento',
    'confirmacao_reuniao',
    'atualizacao_reuniao',
    'lembrete_reuniao',
    'nutricao',
    'alerta_equipe_cadastro',
    'alerta_equipe_orcamento',
    'alerta_equipe_reuniao',
    'alerta_equipe_escalada',
    'relatorio_semanal'
  )),
  destinatario text not null,
  assunto text not null,
  referencia_id uuid,
  status_envio text not null default 'pendente' check (status_envio in ('pendente','enviado','falhou','erro')),
  erro_mensagem text,
  criado_em timestamptz not null default now(),
  enviado_em timestamptz
);

comment on table public.notificacoes is 'Log de todos os e-mails disparados pelo agente GMT.';
comment on column public.notificacoes.tipo is 'Tipo de notificação: confirmação para lead ou alerta para equipe.';
comment on column public.notificacoes.destinatario is 'E-mail de destino.';
comment on column public.notificacoes.referencia_id is 'ID do registro relacionado (orcamento_id, reuniao_id, duvida_id etc.).';
comment on column public.notificacoes.status_envio is 'Status: pendente, enviado, falhou, erro.';
comment on column public.notificacoes.erro_mensagem is 'Mensagem de erro do provedor (Resend) quando status_envio = erro.';

create index if not exists idx_notificacoes_lead_id on public.notificacoes (lead_id);
create index if not exists idx_notificacoes_tipo on public.notificacoes (tipo);
create index if not exists idx_notificacoes_status on public.notificacoes (status_envio);
create index if not exists idx_notificacoes_criado_em on public.notificacoes (criado_em desc);

-- ════════════════════════════════════════════════════════════════════
-- RELATÓRIOS SEMANAIS
-- Intents: relatorio_gerar, relatorio_enviar
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.relatorios (
  id uuid primary key default gen_random_uuid(),
  periodo_inicio date not null,
  periodo_fim date not null,
  leads_novos integer not null default 0,
  leads_qualificados integer not null default 0,
  reunioes_agendadas integer not null default 0,
  reunioes_concluidas integer not null default 0,
  orcamentos_criados integer not null default 0,
  orcamentos_aprovados integer not null default 0,
  duvidas_total integer not null default 0,
  duvidas_escaladas integer not null default 0,
  taxa_resolucao numeric(5,2) default 0,
  corpo_md text,
  enviado boolean not null default false,
  criado_em timestamptz not null default now()
);

comment on table public.relatorios is 'Relatórios semanais consolidados para o proprietário.';
comment on column public.relatorios.periodo_inicio is 'Data de início do período (segunda-feira).';
comment on column public.relatorios.periodo_fim is 'Data de fim do período (domingo).';
comment on column public.relatorios.taxa_resolucao is 'Percentual de dúvidas resolvidas pelo agente sem escalada.';
comment on column public.relatorios.corpo_md is 'Corpo do relatório em Markdown (gerado pelo agente).';
comment on column public.relatorios.enviado is 'Se o relatório já foi enviado ao proprietário.';

create index if not exists idx_relatorios_periodo on public.relatorios (periodo_inicio desc);

-- ════════════════════════════════════════════════════════════════════
-- INTERAÇÕES / LOG DE CONVERSA (auditoria)
-- Suporte a: conversa_geral, resolver_lead, fora_de_escopo
-- ════════════════════════════════════════════════════════════════════

create table if not exists public.interacoes (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references public.leads(id) on delete set null,
  sessao_id text,
  intent text not null,
  mensagem_usuario text,
  resposta_agente text,
  tool_chamada text,
  criado_em timestamptz not null default now()
);

comment on table public.interacoes is 'Log de todas as interações do agente GMT (auditoria e métricas).';
comment on column public.interacoes.sessao_id is 'ID da sessão/thread do chat.';
comment on column public.interacoes.intent is 'Intent detectada (ex.: lead_cadastrar, duvida_responder, fora_de_escopo).';
comment on column public.interacoes.tool_chamada is 'Nome da tool executada (null se nenhuma).';

create index if not exists idx_interacoes_lead_id on public.interacoes (lead_id);
create index if not exists idx_interacoes_intent on public.interacoes (intent);
create index if not exists idx_interacoes_criado_em on public.interacoes (criado_em desc);
create index if not exists idx_interacoes_sessao on public.interacoes (sessao_id);
