-- Security hardening (public API lockdown)
-- Objetivo:
-- 1) Garantir RLS + deny explícito para anon/authenticated nas tabelas sensíveis.
-- 2) Revogar grants diretos de tabela/sequência/funções para anon/authenticated.
-- 3) Cobrir nomes atuais (rag_*) e legados (kb_*) de forma idempotente.
--
-- Observação:
-- O backend Python conecta com credenciais privilegiadas (postgres/service role)
-- e continua funcional. Este script fecha somente acesso via chave pública/anon.

-- ════════════════════════════════════════════════════════════════════════
-- 1) Tabelas protegidas (domínio + RAG + checkpoints)
-- ════════════════════════════════════════════════════════════════════════
do $$
declare
  tbl text;
begin
  foreach tbl in array array[
    -- domínio
    'status_lead', 'status_orcamento', 'status_reuniao',
    'leads', 'duvidas', 'orcamentos', 'itens_orcamento',
    'reunioes', 'sequencias_nutricao', 'nutricao_leads',
    'notificacoes', 'relatorios', 'interacoes', 'disponibilidade_config',

    -- rag atual
    'rag_docs', 'rag_chunks',
    -- legados
    'kb_docs', 'kb_chunks',

    -- checkpoints langgraph
    'checkpoint_migrations', 'checkpoints', 'checkpoint_blobs', 'checkpoint_writes'
  ]
  loop
    if to_regclass(format('public.%I', tbl)) is not null then
      -- RLS ligado em tudo
      execute format('alter table public.%I enable row level security', tbl);
      -- Revoga todo acesso direto por roles de API pública
      execute format('revoke all on table public.%I from anon, authenticated', tbl);
    end if;
  end loop;
end $$;

-- ════════════════════════════════════════════════════════════════════════
-- 2) Policies restritivas explícitas (deny-by-policy) para anon/authenticated
-- ════════════════════════════════════════════════════════════════════════
do $$
declare
  tbl text;
  pol_name text;
begin
  foreach tbl in array array[
    'status_lead', 'status_orcamento', 'status_reuniao',
    'leads', 'duvidas', 'orcamentos', 'itens_orcamento',
    'reunioes', 'sequencias_nutricao', 'nutricao_leads',
    'notificacoes', 'relatorios', 'interacoes', 'disponibilidade_config',
    'rag_docs', 'rag_chunks',
    'kb_docs', 'kb_chunks',
    'checkpoint_migrations', 'checkpoints', 'checkpoint_blobs', 'checkpoint_writes'
  ]
  loop
    if to_regclass(format('public.%I', tbl)) is null then
      continue;
    end if;

    pol_name := tbl || '_deny_api';
    if not exists (
      select 1
      from pg_policies
      where schemaname = 'public'
        and tablename = tbl
        and policyname = pol_name
    ) then
      execute format(
        'create policy %I on public.%I as restrictive for all to anon, authenticated using (false)',
        pol_name,
        tbl
      );
    end if;
  end loop;
end $$;

-- ════════════════════════════════════════════════════════════════════════
-- 3) Revogar uso de sequências das tabelas protegidas (defesa extra)
-- ════════════════════════════════════════════════════════════════════════
do $$
declare
  seq_rec record;
begin
  for seq_rec in
    select sequence_schema, sequence_name
    from information_schema.sequences
    where sequence_schema = 'public'
  loop
    execute format(
      'revoke all on sequence %I.%I from anon, authenticated',
      seq_rec.sequence_schema,
      seq_rec.sequence_name
    );
  end loop;
end $$;

-- ════════════════════════════════════════════════════════════════════════
-- 4) Revogar execução de funções de busca RAG/KB pela API pública
-- ════════════════════════════════════════════════════════════════════════
do $$
declare
  fn record;
begin
  for fn in
    select p.oid::regprocedure as sig
    from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname in (
        'rag_vector_search', 'rag_text_search', 'rag_hybrid_search',
        'kb_vector_search', 'kb_text_search', 'kb_hybrid_search'
      )
  loop
    execute format('revoke all on function %s from anon, authenticated', fn.sig);
  end loop;
end $$;

comment on schema public is
  'Schema público GMT endurecido: anon/authenticated sem acesso às tabelas/funções de domínio e RAG; backend server-side exclusivo.';
