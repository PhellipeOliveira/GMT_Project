-- LangGraph AsyncPostgresSaver — schema versionado
-- Fonte: langgraph-checkpoint-postgres==2.0.23 (base.MIGRATIONS)
-- Substitui a criação implícita em runtime (webapp.py checkpointer.setup()).
-- Idempotente: CREATE IF NOT EXISTS / ADD COLUMN IF NOT EXISTS.

create table if not exists public.checkpoint_migrations (
  v integer primary key
);

create table if not exists public.checkpoints (
  thread_id text not null,
  checkpoint_ns text not null default '',
  checkpoint_id text not null,
  parent_checkpoint_id text,
  type text,
  checkpoint jsonb not null,
  metadata jsonb not null default '{}',
  primary key (thread_id, checkpoint_ns, checkpoint_id)
);

create table if not exists public.checkpoint_blobs (
  thread_id text not null,
  checkpoint_ns text not null default '',
  channel text not null,
  version text not null,
  type text not null,
  blob bytea,
  primary key (thread_id, checkpoint_ns, channel, version)
);

create table if not exists public.checkpoint_writes (
  thread_id text not null,
  checkpoint_ns text not null default '',
  checkpoint_id text not null,
  task_id text not null,
  idx integer not null,
  channel text not null,
  type text,
  blob bytea not null,
  primary key (thread_id, checkpoint_ns, checkpoint_id, task_id, idx)
);

-- Migração v4 do pacote: blob passa a ser nullable
alter table public.checkpoint_blobs alter column blob drop not null;

-- Índices (sem CONCURRENTLY — migrations Supabase rodam em transação)
create index if not exists checkpoints_thread_id_idx on public.checkpoints (thread_id);
create index if not exists checkpoint_blobs_thread_id_idx on public.checkpoint_blobs (thread_id);
create index if not exists checkpoint_writes_thread_id_idx on public.checkpoint_writes (thread_id);

-- Migração v9 do pacote: coluna task_path
alter table public.checkpoint_writes
  add column if not exists task_path text not null default '';

comment on table public.checkpoints is 'LangGraph — estado de checkpoint por thread (persistência do agente GMT).';
comment on table public.checkpoint_blobs is 'LangGraph — blobs de canal por checkpoint.';
comment on table public.checkpoint_writes is 'LangGraph — writes pendentes por checkpoint.';
comment on table public.checkpoint_migrations is 'LangGraph — versão do schema interno do checkpointer.';
