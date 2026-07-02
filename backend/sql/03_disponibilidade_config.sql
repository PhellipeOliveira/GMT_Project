-- Agente GMT — Configuração de disponibilidade da agenda
-- Fonte de verdade das regras de disponibilidade para `verificar_disponibilidade`.
-- A tabela `public.reunioes` continua sendo a fonte de verdade dos horários OCUPADOS.
-- Google Calendar (push one-way) é P1 separado — não implementado aqui.
-- Requisitos: Postgres ≥ 14 com pgcrypto (habilitado em 01_gmt_agent_schema.sql).

create extension if not exists "pgcrypto";

create table if not exists public.disponibilidade_config (
  id uuid primary key default gen_random_uuid(),
  dia_semana smallint not null check (dia_semana between 0 and 6),  -- 0=seg, 1=ter, ... 6=dom
  hora_inicio time not null,
  hora_fim time not null,
  duracao_slot_min integer not null default 60 check (duracao_slot_min > 0),
  fuso_horario text not null default 'Europe/Lisbon',
  ativo boolean not null default true,
  created_at timestamptz not null default now(),
  check (hora_fim > hora_inicio),
  unique (dia_semana, hora_inicio, hora_fim)
);

comment on table public.disponibilidade_config is 'Regras de disponibilidade da agenda GMT (janelas por dia da semana).';
comment on column public.disponibilidade_config.dia_semana is 'Dia da semana: 0=segunda, 1=terça, ..., 6=domingo (igual a Python date.weekday()).';
comment on column public.disponibilidade_config.hora_inicio is 'Início da janela de atendimento (hora local do fuso_horario).';
comment on column public.disponibilidade_config.hora_fim is 'Fim da janela de atendimento (hora local do fuso_horario).';
comment on column public.disponibilidade_config.duracao_slot_min is 'Duração de cada slot em minutos (default 60).';
comment on column public.disponibilidade_config.fuso_horario is 'Fuso horário IANA das janelas (default Europe/Lisbon).';
comment on column public.disponibilidade_config.ativo is 'Se a janela está ativa e deve ser considerada na disponibilidade.';

create index if not exists idx_disponibilidade_dia_semana on public.disponibilidade_config (dia_semana) where ativo;

-- ────────────────────────────────────────────────────────────────────
-- Seed: disponibilidade padrão (segunda a sexta, 10h–17h, slots de 60 min)
-- Idempotente via ON CONFLICT (dia_semana, hora_inicio, hora_fim).
-- ────────────────────────────────────────────────────────────────────
insert into public.disponibilidade_config (dia_semana, hora_inicio, hora_fim, duracao_slot_min, fuso_horario, ativo)
values
  (0, '10:00', '17:00', 60, 'Europe/Lisbon', true),  -- segunda
  (1, '10:00', '17:00', 60, 'Europe/Lisbon', true),  -- terça
  (2, '10:00', '17:00', 60, 'Europe/Lisbon', true),  -- quarta
  (3, '10:00', '17:00', 60, 'Europe/Lisbon', true),  -- quinta
  (4, '10:00', '17:00', 60, 'Europe/Lisbon', true)   -- sexta
on conflict (dia_semana, hora_inicio, hora_fim) do nothing;
