# Supabase Security Checklist (Etapa 3)

Checklist operacional para validar que **somente o backend** acessa dados de leads/reuniões.

## 1) Aplicar migration de hardening

No projeto Supabase (SQL Editor), execute:

- `backend/supabase/migrations/20260715132000_security_hardening_public_api.sql`

Se você usa CLI/pipeline de migrations, aplique normalmente com seu fluxo de deploy.

## 2) Validar RLS habilitado nas tabelas críticas

No SQL Editor, rode:

```sql
select schemaname, tablename, rowsecurity
from pg_tables
where schemaname = 'public'
  and tablename in (
    'leads','reunioes','notificacoes','duvidas','interacoes',
    'rag_docs','rag_chunks','disponibilidade_config',
    'checkpoints','checkpoint_blobs','checkpoint_writes','checkpoint_migrations'
  )
order by tablename;
```

Esperado: `rowsecurity = true` para todas.

## 3) Validar policies de bloqueio (deny_api)

```sql
select schemaname, tablename, policyname, permissive, roles, cmd
from pg_policies
where schemaname = 'public'
  and tablename in (
    'leads','reunioes','notificacoes','duvidas','interacoes',
    'rag_docs','rag_chunks','disponibilidade_config',
    'checkpoints','checkpoint_blobs','checkpoint_writes','checkpoint_migrations'
  )
order by tablename, policyname;
```

Esperado: policies `*_deny_api` para `anon` e `authenticated` (restrictive).

## 4) Validar grants revogados (tabelas)

```sql
select grantee, table_name, privilege_type
from information_schema.role_table_grants
where table_schema = 'public'
  and grantee in ('anon','authenticated')
  and table_name in (
    'leads','reunioes','notificacoes','duvidas','interacoes',
    'rag_docs','rag_chunks','disponibilidade_config',
    'checkpoints','checkpoint_blobs','checkpoint_writes','checkpoint_migrations'
  )
order by grantee, table_name, privilege_type;
```

Esperado: **0 linhas**.

## 5) Validar execução revogada das funções RAG

```sql
select n.nspname as schema_name,
       p.proname as function_name,
       has_function_privilege('anon', p.oid, 'EXECUTE') as anon_can_execute,
       has_function_privilege('authenticated', p.oid, 'EXECUTE') as auth_can_execute
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and p.proname in ('rag_vector_search','rag_text_search','rag_hybrid_search',
                    'kb_vector_search','kb_text_search','kb_hybrid_search')
order by function_name;
```

Esperado: `false` para `anon_can_execute` e `auth_can_execute`.

## 6) Verificar chaves no frontend (manual)

- Em Vercel/Render (frontend), confirme que **não** existe `SUPABASE_SERVICE_ROLE_KEY`.
- Em código frontend, confirme que não há cliente Supabase com service role.
- Mantenha apenas variáveis necessárias ao frontend público.

## 7) Verificar Data API/REST do Supabase

Se não for usar API REST pública para essas tabelas:

- mantenha sem grants para `anon/authenticated` (já coberto pelas migrations),
- e não exponha endpoints PostgREST custom com bypass.

## 8) Smoke test de segurança (manual)

1. Chame o site/chat normalmente (deve continuar funcionando via backend).
2. Tente consulta direta via chave `anon` nas tabelas `leads/reunioes` (deve falhar).
3. Valide que agendamento/cancelamento via backend segue operacional.

## 9) Em caso de emergência (rollback lógico)

Se algo quebrar por política/grant:

- reveja se o backend está usando conexão privilegiada correta (`SUPABASE_DB_URL`),
- não conceda acesso a `anon`/`authenticated` nas tabelas sensíveis,
- aplique correção em nova migration (evite editar histórico em produção).
