-- Governança RLS — formaliza o estado de segurança das tabelas de domínio.
-- Estratégia: RLS ON + sem policies permissivas = deny-by-default para anon/authenticated.
-- O backend (postgres/service_role) ignora RLS e continua com acesso total.
-- Idempotente.

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
    execute format('alter table public.%I enable row level security', tbl);
  end loop;
end $$;

-- Policies restritivas explícitas (documentam a intenção; redundantes com deny-by-default)
do $$
declare
  tbl text;
  pol_name text;
begin
  foreach tbl in array array[
    'status_lead', 'status_orcamento', 'status_reuniao',
    'leads', 'duvidas', 'orcamentos', 'itens_orcamento',
    'reunioes', 'sequencias_nutricao', 'nutricao_leads',
    'notificacoes', 'relatorios', 'interacoes',
    'kb_docs', 'kb_chunks', 'disponibilidade_config'
  ]
  loop
    pol_name := tbl || '_deny_api';
    if not exists (
      select 1 from pg_policies
      where schemaname = 'public' and tablename = tbl and policyname = pol_name
    ) then
      execute format(
        'create policy %I on public.%I as restrictive for all to anon, authenticated using (false)',
        pol_name, tbl
      );
    end if;
  end loop;
end $$;

comment on schema public is
  'Schema público do Agente GMT. Tabelas de domínio: RLS deny-by-default para anon/authenticated. '
  'Acesso de escrita/leitura exclusivo via backend Python (conexão postgres).';
