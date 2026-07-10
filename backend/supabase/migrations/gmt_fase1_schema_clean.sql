-- ============================================================
-- GMT — Schema Fase 1 (Receção Digital)
-- Projeto: Agente GMT (widget site)
-- Fase 2 (Agente Comercial) será projeto separado com integração via webhook.
--
-- Como aplicar no Supabase:
--   1. Abre o Supabase SQL Editor
--   2. Executa o BLOCO 1 (drop) — limpa tabelas existentes
--   3. Executa o BLOCO 2 (schema) — recria apenas o necessário
-- ============================================================

-- ════ BLOCO 1: Limpa tabelas existentes (dev — banco vazio) ════
-- Execute primeiro. Ordem importa por causa das foreign keys.

DROP TABLE IF EXISTS public.interacoes CASCADE;
DROP TABLE IF EXISTS public.notificacoes CASCADE;
DROP TABLE IF EXISTS public.reunioes CASCADE;
DROP TABLE IF EXISTS public.duvidas CASCADE;
DROP TABLE IF EXISTS public.itens_orcamento CASCADE;
DROP TABLE IF EXISTS public.orcamentos CASCADE;
DROP TABLE IF EXISTS public.nutricao_leads CASCADE;
DROP TABLE IF EXISTS public.sequencias_nutricao CASCADE;
DROP TABLE IF EXISTS public.relatorios CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;
DROP TABLE IF EXISTS public.status_reuniao CASCADE;
DROP TABLE IF EXISTS public.status_orcamento CASCADE;
DROP TABLE IF EXISTS public.status_lead CASCADE;
DROP TABLE IF EXISTS public.disponibilidade_config CASCADE;
DROP TABLE IF EXISTS public.gcal_event_id CASCADE;
DROP TABLE IF EXISTS public.rag_chunks CASCADE;
DROP TABLE IF EXISTS public.rag_docs CASCADE;
DROP TABLE IF EXISTS public.kb_chunks CASCADE;
DROP TABLE IF EXISTS public.kb_docs CASCADE;
DROP FUNCTION IF EXISTS public.rag_vector_search CASCADE;
DROP FUNCTION IF EXISTS public.rag_text_search CASCADE;
DROP FUNCTION IF EXISTS public.rag_hybrid_search CASCADE;
DROP FUNCTION IF EXISTS public.kb_vector_search CASCADE;
DROP FUNCTION IF EXISTS public.kb_text_search CASCADE;
DROP FUNCTION IF EXISTS public.kb_hybrid_search CASCADE;

-- ════ BLOCO 2: Schema Fase 1 ════

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS vector;
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ── Lookup: Status do lead no funil ──
CREATE TABLE IF NOT EXISTS public.status_lead (
  codigo text PRIMARY KEY,
  rotulo text NOT NULL,
  ordem smallint NOT NULL DEFAULT 0,
  criado_em timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.status_lead (codigo, rotulo, ordem) VALUES
  ('novo',             'Novo',             1),
  ('em_contato',       'Em contato',       2),
  ('qualificado',      'Qualificado',      3),
  ('proposta_enviada', 'Proposta enviada', 4),
  ('fechado',          'Fechado (ganho)',   5),
  ('perdido',          'Perdido',          6)
ON CONFLICT (codigo) DO NOTHING;

-- ── Lookup: Status da reunião ──
CREATE TABLE IF NOT EXISTS public.status_reuniao (
  codigo text PRIMARY KEY,
  rotulo text NOT NULL,
  criado_em timestamptz NOT NULL DEFAULT now()
);

INSERT INTO public.status_reuniao (codigo, rotulo) VALUES
  ('agendada',  'Agendada'),
  ('remarcada', 'Remarcada'),
  ('cancelada', 'Cancelada'),
  ('concluida', 'Concluída')
ON CONFLICT (codigo) DO NOTHING;

-- ── Leads ──
CREATE TABLE IF NOT EXISTS public.leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  nome text NOT NULL,
  email text,
  telefone text,
  empresa text,
  origem text DEFAULT 'chat_site',
  qualificado boolean NOT NULL DEFAULT false,
  score smallint DEFAULT 0 CHECK (score >= 0 AND score <= 100),
  etapa_funil text,
  status_codigo text NOT NULL REFERENCES public.status_lead(codigo) DEFAULT 'novo',
  consentimento_lgpd boolean NOT NULL DEFAULT false,
  ultimo_contato_em timestamptz,
  proxima_acao_em timestamptz,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT chk_leads_contato CHECK (email IS NOT NULL OR telefone IS NOT NULL)
);

CREATE UNIQUE INDEX IF NOT EXISTS uq_leads_email ON public.leads (lower(email)) WHERE email IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_status_codigo ON public.leads (status_codigo);
CREATE INDEX IF NOT EXISTS idx_leads_criado_em ON public.leads (criado_em DESC);
CREATE UNIQUE INDEX IF NOT EXISTS uq_leads_phone_digits
  ON public.leads ((regexp_replace(telefone, '[^0-9]', '', 'g'))) WHERE telefone IS NOT NULL;

-- ── Dúvidas / RAG ──
CREATE TABLE IF NOT EXISTS public.duvidas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  pergunta text NOT NULL,
  resposta text,
  fonte text,
  respondida_por_agente boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_duvidas_lead_id ON public.duvidas (lead_id);
CREATE INDEX IF NOT EXISTS idx_duvidas_criado_em ON public.duvidas (criado_em DESC);

-- ── Reuniões ──
CREATE TABLE IF NOT EXISTS public.reunioes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  data_hora timestamptz NOT NULL,
  tipo text NOT NULL DEFAULT 'online' CHECK (tipo IN ('presencial','online')),
  local text,
  status_codigo text NOT NULL REFERENCES public.status_reuniao(codigo) DEFAULT 'agendada',
  observacoes text,
  lembrete_24h_enviado boolean NOT NULL DEFAULT false,
  lembrete_1h_enviado boolean NOT NULL DEFAULT false,
  gcal_event_id text,
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_reunioes_lead_id ON public.reunioes (lead_id);
CREATE INDEX IF NOT EXISTS idx_reunioes_data_hora ON public.reunioes (data_hora);
CREATE INDEX IF NOT EXISTS idx_reunioes_status ON public.reunioes (status_codigo);

-- ── Notificações (log de e-mails) ──
CREATE TABLE IF NOT EXISTS public.notificacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  tipo text NOT NULL CHECK (tipo IN (
    'confirmacao_cadastro',
    'confirmacao_reuniao',
    'atualizacao_reuniao',
    'alerta_equipe_cadastro',
    'alerta_equipe_reuniao'
  )),
  destinatario text NOT NULL,
  assunto text NOT NULL,
  referencia_id uuid,
  status_envio text NOT NULL DEFAULT 'pendente' CHECK (status_envio IN ('pendente','enviado','falhou','erro')),
  erro_mensagem text,
  criado_em timestamptz NOT NULL DEFAULT now(),
  enviado_em timestamptz
);

CREATE INDEX IF NOT EXISTS idx_notificacoes_lead_id ON public.notificacoes (lead_id);
CREATE INDEX IF NOT EXISTS idx_notificacoes_tipo ON public.notificacoes (tipo);
CREATE INDEX IF NOT EXISTS idx_notificacoes_criado_em ON public.notificacoes (criado_em DESC);

-- ── Disponibilidade (configuração de agenda) ──
CREATE TABLE IF NOT EXISTS public.disponibilidade_config (
  id smallint PRIMARY KEY DEFAULT 1,
  dia_semana_inicio smallint NOT NULL DEFAULT 1,
  dia_semana_fim smallint NOT NULL DEFAULT 5,
  hora_inicio time NOT NULL DEFAULT '13:00',
  hora_fim time NOT NULL DEFAULT '19:00',
  duracao_minutos smallint NOT NULL DEFAULT 30,
  fuso_horario text NOT NULL DEFAULT 'Europe/Lisbon',
  CONSTRAINT singleton CHECK (id = 1)
);

INSERT INTO public.disponibilidade_config (id) VALUES (1) ON CONFLICT DO NOTHING;

-- ── Interações / Log de auditoria ──
CREATE TABLE IF NOT EXISTS public.interacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid REFERENCES public.leads(id) ON DELETE SET NULL,
  sessao_id text,
  intent text NOT NULL,
  mensagem_usuario text,
  resposta_agente text,
  tool_chamada text,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_interacoes_lead_id ON public.interacoes (lead_id);
CREATE INDEX IF NOT EXISTS idx_interacoes_intent ON public.interacoes (intent);
CREATE INDEX IF NOT EXISTS idx_interacoes_criado_em ON public.interacoes (criado_em DESC);
CREATE INDEX IF NOT EXISTS idx_interacoes_sessao ON public.interacoes (sessao_id);

-- ── RAG Docs (staging) ──
CREATE TABLE IF NOT EXISTS public.rag_docs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  source_path text NOT NULL,
  source_hash text NOT NULL,
  mime_type text NOT NULL DEFAULT 'text/markdown',
  content text NOT NULL,
  categoria text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_rag_docs_source UNIQUE (source_path, source_hash)
);

CREATE INDEX IF NOT EXISTS ix_rag_docs_categoria ON public.rag_docs (categoria);

-- ── RAG Chunks (vetores) ──
CREATE TABLE IF NOT EXISTS public.rag_chunks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  doc_path text NOT NULL,
  chunk_ix integer NOT NULL,
  content text NOT NULL,
  embedding vector(1536) NOT NULL,
  categoria text,
  meta jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT uq_rag_chunks_doc_chunk UNIQUE (doc_path, chunk_ix)
);

CREATE INDEX IF NOT EXISTS ix_rag_chunks_categoria ON public.rag_chunks (categoria);
CREATE INDEX IF NOT EXISTS ix_rag_chunks_embedding
  ON public.rag_chunks
  USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
CREATE INDEX IF NOT EXISTS ix_rag_chunks_content_fts
  ON public.rag_chunks
  USING gin (to_tsvector('portuguese', content));

-- ── Funções de busca RAG ──
CREATE OR REPLACE FUNCTION public.rag_vector_search(
  p_vec vector(1536),
  p_k integer DEFAULT 5,
  p_threshold double precision DEFAULT NULL,
  p_categoria text DEFAULT NULL,
  p_chunking text DEFAULT NULL
)
RETURNS TABLE (
  doc_path text,
  chunk_ix integer,
  content text,
  score double precision,
  meta jsonb
)
LANGUAGE sql STABLE
AS $$
  SELECT
    c.doc_path,
    c.chunk_ix,
    c.content,
    (1 - (c.embedding <=> p_vec))::double precision AS score,
    c.meta
  FROM public.rag_chunks c
  WHERE (p_categoria IS NULL OR lower(c.categoria) = lower(p_categoria))
    AND (p_chunking IS NULL OR lower(c.meta->>'chunking') = lower(p_chunking))
    AND (p_threshold IS NULL OR (1 - (c.embedding <=> p_vec)) >= p_threshold)
  ORDER BY c.embedding <=> p_vec ASC
  LIMIT greatest(p_k, 1);
$$;

CREATE OR REPLACE FUNCTION public.rag_text_search(
  p_query text,
  p_k integer DEFAULT 5,
  p_categoria text DEFAULT NULL,
  p_chunking text DEFAULT NULL
)
RETURNS TABLE (
  doc_path text,
  chunk_ix integer,
  content text,
  score double precision,
  meta jsonb
)
LANGUAGE sql STABLE
AS $$
  SELECT
    c.doc_path,
    c.chunk_ix,
    c.content,
    ts_rank_cd(
      to_tsvector('portuguese', c.content),
      plainto_tsquery('portuguese', p_query)
    )::double precision AS score,
    c.meta
  FROM public.rag_chunks c
  WHERE (p_categoria IS NULL OR lower(c.categoria) = lower(p_categoria))
    AND (p_chunking IS NULL OR lower(c.meta->>'chunking') = lower(p_chunking))
    AND to_tsvector('portuguese', c.content) @@ plainto_tsquery('portuguese', p_query)
  ORDER BY score DESC
  LIMIT greatest(p_k, 1);
$$;

CREATE OR REPLACE FUNCTION public.rag_hybrid_search(
  p_query text,
  p_vec vector(1536),
  p_k integer DEFAULT 5,
  p_threshold double precision DEFAULT NULL,
  p_categoria text DEFAULT NULL,
  p_chunking text DEFAULT NULL
)
RETURNS TABLE (
  doc_path text,
  chunk_ix integer,
  content text,
  score double precision,
  meta jsonb
)
LANGUAGE sql STABLE
AS $$
  WITH
  pool AS (
    SELECT greatest(p_k, 1) * 5 AS n
  ),
  vec AS (
    SELECT
      c.doc_path, c.chunk_ix, c.content, c.meta,
      row_number() OVER (ORDER BY c.embedding <=> p_vec ASC) AS rnk
    FROM public.rag_chunks c, pool
    WHERE (p_categoria IS NULL OR lower(c.categoria) = lower(p_categoria))
      AND (p_chunking IS NULL OR lower(c.meta->>'chunking') = lower(p_chunking))
      AND (p_threshold IS NULL OR (1 - (c.embedding <=> p_vec)) >= p_threshold)
    ORDER BY c.embedding <=> p_vec ASC
    LIMIT (SELECT n FROM pool)
  ),
  txt AS (
    SELECT
      c.doc_path, c.chunk_ix, c.content, c.meta,
      row_number() OVER (
        ORDER BY ts_rank_cd(
          to_tsvector('portuguese', c.content),
          plainto_tsquery('portuguese', p_query)
        ) DESC
      ) AS rnk
    FROM public.rag_chunks c, pool
    WHERE (p_categoria IS NULL OR lower(c.categoria) = lower(p_categoria))
      AND (p_chunking IS NULL OR lower(c.meta->>'chunking') = lower(p_chunking))
      AND to_tsvector('portuguese', c.content) @@ plainto_tsquery('portuguese', p_query)
    ORDER BY rnk
    LIMIT (SELECT n FROM pool)
  ),
  fused AS (
    SELECT
      coalesce(v.doc_path, t.doc_path) AS doc_path,
      coalesce(v.chunk_ix, t.chunk_ix) AS chunk_ix,
      coalesce(v.content, t.content) AS content,
      coalesce(v.meta, t.meta) AS meta,
      coalesce(1.0 / (60 + v.rnk), 0.0)
      + coalesce(1.0 / (60 + t.rnk), 0.0) AS score
    FROM vec v
    FULL OUTER JOIN txt t
      ON v.doc_path = t.doc_path AND v.chunk_ix = t.chunk_ix
  )
  SELECT doc_path, chunk_ix, content, score::double precision, meta
  FROM fused
  ORDER BY score DESC
  LIMIT greatest(p_k, 1);
$$;

-- ── Trigger utilitário: manter updated_at atualizado ──
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS trigger LANGUAGE plpgsql AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_rag_docs_updated_at ON public.rag_docs;
CREATE TRIGGER trg_rag_docs_updated_at
  BEFORE UPDATE ON public.rag_docs
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

DROP TRIGGER IF EXISTS trg_rag_chunks_updated_at ON public.rag_chunks;
CREATE TRIGGER trg_rag_chunks_updated_at
  BEFORE UPDATE ON public.rag_chunks
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.duvidas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reunioes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notificacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.interacoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.disponibilidade_config ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_lead ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.status_reuniao ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_docs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rag_chunks ENABLE ROW LEVEL SECURITY;

CREATE POLICY leads_deny_api ON public.leads AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
CREATE POLICY duvidas_deny_api ON public.duvidas AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
CREATE POLICY reunioes_deny_api ON public.reunioes AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
CREATE POLICY notificacoes_deny_api ON public.notificacoes AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
CREATE POLICY interacoes_deny_api ON public.interacoes AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
CREATE POLICY disponibilidade_deny_api ON public.disponibilidade_config AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
CREATE POLICY status_lead_deny_api ON public.status_lead AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
CREATE POLICY status_reuniao_deny_api ON public.status_reuniao AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
CREATE POLICY rag_docs_deny_api ON public.rag_docs AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);
CREATE POLICY rag_chunks_deny_api ON public.rag_chunks AS RESTRICTIVE FOR ALL TO anon, authenticated USING (false);

-- ════ FIM DO SCHEMA FASE 1 ════
-- Tabelas de checkpoint LangGraph: aplicar migration 000006 separadamente (langgraph_checkpoints).
-- Fase 2 (Agente Comercial): schema separado no projeto do Agente Comercial.
