-- Segurança — bloqueio imediato de exposição via PostgREST (roles anon/authenticated).
-- O backend Python conecta como postgres (bypass RLS) — não depende destes grants.
-- Idempotente: REVOKE e ENABLE RLS são seguros de reaplicar.

-- ════════════════════════════════════════════════════════════════════
-- 1. LangGraph checkpoints — dados sensíveis (estado de conversas / PII)
-- ════════════════════════════════════════════════════════════════════
alter table if exists public.checkpoint_migrations enable row level security;
alter table if exists public.checkpoints enable row level security;
alter table if exists public.checkpoint_blobs enable row level security;
alter table if exists public.checkpoint_writes enable row level security;

revoke all on table public.checkpoint_migrations from anon, authenticated;
revoke all on table public.checkpoints from anon, authenticated;
revoke all on table public.checkpoint_blobs from anon, authenticated;
revoke all on table public.checkpoint_writes from anon, authenticated;

-- Policies explícitas de negação (documentação + defesa se grants forem reintroduzidos)
do $$ begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'checkpoints' and policyname = 'checkpoints_deny_api'
  ) then
    create policy checkpoints_deny_api on public.checkpoints
      as restrictive for all to anon, authenticated using (false);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'checkpoint_blobs' and policyname = 'checkpoint_blobs_deny_api'
  ) then
    create policy checkpoint_blobs_deny_api on public.checkpoint_blobs
      as restrictive for all to anon, authenticated using (false);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'checkpoint_writes' and policyname = 'checkpoint_writes_deny_api'
  ) then
    create policy checkpoint_writes_deny_api on public.checkpoint_writes
      as restrictive for all to anon, authenticated using (false);
  end if;
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'checkpoint_migrations' and policyname = 'checkpoint_migrations_deny_api'
  ) then
    create policy checkpoint_migrations_deny_api on public.checkpoint_migrations
      as restrictive for all to anon, authenticated using (false);
  end if;
end $$;

-- ════════════════════════════════════════════════════════════════════
-- 2. Tabelas de domínio — revogar acesso direto via API pública
--    (RLS formalizado na mig. 000008; aqui removemos grants herdados do Supabase)
-- ════════════════════════════════════════════════════════════════════
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    'status_lead', 'status_orcamento', 'status_reuniao',
    'leads', 'duvidas', 'orcamentos', 'itens_orcamento',
    'reunioes', 'sequencias_nutricao', 'nutricao_leads',
    'notificacoes', 'relatorios', 'interacoes',
    'kb_docs', 'kb_chunks', 'disponibilidade_config'
  ]
  loop
    execute format('revoke all on table public.%I from anon, authenticated', tbl);
  end loop;
end $$;

-- Funções RAG — não devem ser invocáveis via PostgREST com chave anon
do $$
declare
  fn record;
begin
  for fn in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in ('kb_vector_search', 'kb_text_search', 'kb_hybrid_search')
  loop
    execute format('revoke all on function %s from anon, authenticated', fn.sig);
  end loop;
end $$;
