-- =====================================================================
-- 02_gmt_kb_schema.sql
-- Knowledge Base (RAG) do Agente GMT — Supabase / Postgres + pgvector
-- ---------------------------------------------------------------------
-- Alimenta a intent `duvida_responder` do agente de recepção da GMT.
-- Fonte do KB: conteúdo público do site (Produto, Institucional, Serviços, FAQ, Políticas).
--
-- Compatível com:
--   ingest.py       -> kb_docs (staging) e kb_chunks (upsert por doc_path, chunk_ix)
--   rag_tools.py    -> kb_vector_search / kb_text_search / kb_hybrid_search
--
-- Dimensão de embedding: 1536 (OpenAI text-embedding-3-small)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. Extensões necessárias
-- ---------------------------------------------------------------------
create extension if not exists vector;   -- pgvector
create extension if not exists pg_trgm;  -- busca textual / trigram (opcional)

-- ---------------------------------------------------------------------
-- 1. STAGING: kb_docs
--    Documentos brutos (.md do site) antes do chunking.
--    Idempotente por (source_path, source_hash) -> reingestão só grava se mudou.
-- ---------------------------------------------------------------------
create table if not exists public.kb_docs (
    id           uuid primary key default gen_random_uuid(),
    source_path  text        not null,             -- caminho do arquivo .md
    source_hash  text        not null,             -- sha256 do conteúdo
    mime_type    text        not null default 'text/markdown',
    content      text        not null,             -- conteúdo integral do documento
    categoria    text,                             -- 'produto' | 'institucional' | 'faq' | ...
    meta         jsonb       not null default '{}'::jsonb,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now(),
    constraint uq_kb_docs_source unique (source_path, source_hash)
);

create index if not exists ix_kb_docs_categoria on public.kb_docs (categoria);

-- ---------------------------------------------------------------------
-- 2. CHUNKS: kb_chunks
--    Trechos vetorizados. Idempotente por (doc_path, chunk_ix).
-- ---------------------------------------------------------------------
create table if not exists public.kb_chunks (
    id          uuid primary key default gen_random_uuid(),
    doc_path    text          not null,            -- origem do chunk (= source_path)
    chunk_ix    integer       not null,            -- índice do chunk no documento
    content     text          not null,            -- texto do chunk
    embedding   vector(1536)  not null,            -- embedding OpenAI (1536 dims)
    categoria   text,                              -- herdada do documento
    meta        jsonb         not null default '{}'::jsonb,  -- ex.: {"chunking":"markdown"}
    created_at  timestamptz   not null default now(),
    updated_at  timestamptz   not null default now(),
    constraint uq_kb_chunks_doc_chunk unique (doc_path, chunk_ix)
);

create index if not exists ix_kb_chunks_categoria on public.kb_chunks (categoria);

-- Índice vetorial (ANN) — cosine. Ajuste 'lists' conforme volume do KB.
create index if not exists ix_kb_chunks_embedding
    on public.kb_chunks
    using ivfflat (embedding vector_cosine_ops)
    with (lists = 100);

-- Índice textual (full-text em português) para busca 'text' e híbrida.
create index if not exists ix_kb_chunks_content_fts
    on public.kb_chunks
    using gin (to_tsvector('portuguese', content));

-- ---------------------------------------------------------------------
-- 3. FUNÇÃO: kb_vector_search
--    Assinatura usada no rag_tools.py:
--    (vec, k, threshold, categoria, chunking)
--    'score' = similaridade (0..1), maior = mais relevante.
-- ---------------------------------------------------------------------
create or replace function public.kb_vector_search(
    p_vec        vector(1536),
    p_k          integer default 5,
    p_threshold  double precision default null,
    p_categoria  text default null,
    p_chunking   text default null
)
returns table (
    doc_path text,
    chunk_ix integer,
    content  text,
    score    double precision,
    meta     jsonb
)
language sql stable
as $$
    select
        c.doc_path,
        c.chunk_ix,
        c.content,
        (1 - (c.embedding <=> p_vec))::double precision as score,   -- cosine similarity
        c.meta
    from public.kb_chunks c
    where (p_categoria is null or lower(c.categoria) = lower(p_categoria))
      and (p_chunking  is null or lower(c.meta->>'chunking') = lower(p_chunking))
      and (p_threshold is null or (1 - (c.embedding <=> p_vec)) >= p_threshold)
    order by c.embedding <=> p_vec asc
    limit greatest(p_k, 1);
$$;

-- ---------------------------------------------------------------------
-- 4. FUNÇÃO: kb_text_search
--    Assinatura usada no rag_tools.py:
--    (query, k, categoria, chunking)
--    'score' = ts_rank_cd normalizado.
-- ---------------------------------------------------------------------
create or replace function public.kb_text_search(
    p_query      text,
    p_k          integer default 5,
    p_categoria  text default null,
    p_chunking   text default null
)
returns table (
    doc_path text,
    chunk_ix integer,
    content  text,
    score    double precision,
    meta     jsonb
)
language sql stable
as $$
    select
        c.doc_path,
        c.chunk_ix,
        c.content,
        ts_rank_cd(
            to_tsvector('portuguese', c.content),
            plainto_tsquery('portuguese', p_query)
        )::double precision as score,
        c.meta
    from public.kb_chunks c
    where (p_categoria is null or lower(c.categoria) = lower(p_categoria))
      and (p_chunking  is null or lower(c.meta->>'chunking') = lower(p_chunking))
      and to_tsvector('portuguese', c.content) @@ plainto_tsquery('portuguese', p_query)
    order by score desc
    limit greatest(p_k, 1);
$$;

-- ---------------------------------------------------------------------
-- 5. FUNÇÃO: kb_hybrid_search
--    Assinatura usada no rag_tools.py:
--    (query, vec, k, threshold, categoria, chunking)
--    Combina vetorial + textual via Reciprocal Rank Fusion (RRF).
-- ---------------------------------------------------------------------
create or replace function public.kb_hybrid_search(
    p_query      text,
    p_vec        vector(1536),
    p_k          integer default 5,
    p_threshold  double precision default null,
    p_categoria  text default null,
    p_chunking   text default null
)
returns table (
    doc_path text,
    chunk_ix integer,
    content  text,
    score    double precision,
    meta     jsonb
)
language sql stable
as $$
    with
    -- pool de candidatos maior que k para dar espaço à fusão
    pool as (
        select greatest(p_k, 1) * 5 as n
    ),
    vec as (
        select
            c.doc_path, c.chunk_ix, c.content, c.meta,
            row_number() over (order by c.embedding <=> p_vec asc) as rnk
        from public.kb_chunks c, pool
        where (p_categoria is null or lower(c.categoria) = lower(p_categoria))
          and (p_chunking  is null or lower(c.meta->>'chunking') = lower(p_chunking))
          and (p_threshold is null or (1 - (c.embedding <=> p_vec)) >= p_threshold)
        order by c.embedding <=> p_vec asc
        limit (select n from pool)
    ),
    txt as (
        select
            c.doc_path, c.chunk_ix, c.content, c.meta,
            row_number() over (
                order by ts_rank_cd(
                    to_tsvector('portuguese', c.content),
                    plainto_tsquery('portuguese', p_query)
                ) desc
            ) as rnk
        from public.kb_chunks c, pool
        where (p_categoria is null or lower(c.categoria) = lower(p_categoria))
          and (p_chunking  is null or lower(c.meta->>'chunking') = lower(p_chunking))
          and to_tsvector('portuguese', c.content) @@ plainto_tsquery('portuguese', p_query)
        order by rnk
        limit (select n from pool)
    ),
    fused as (
        select
            coalesce(v.doc_path, t.doc_path) as doc_path,
            coalesce(v.chunk_ix, t.chunk_ix) as chunk_ix,
            coalesce(v.content, t.content)   as content,
            coalesce(v.meta, t.meta)         as meta,
            -- RRF: soma de 1/(k_const + rank) de cada lista (k_const=60, padrão)
            coalesce(1.0 / (60 + v.rnk), 0.0)
          + coalesce(1.0 / (60 + t.rnk), 0.0) as score
        from vec v
        full outer join txt t
            on v.doc_path = t.doc_path and v.chunk_ix = t.chunk_ix
    )
    select doc_path, chunk_ix, content, score::double precision, meta
    from fused
    order by score desc
    limit greatest(p_k, 1);
$$;

-- ---------------------------------------------------------------------
-- 6. Trigger utilitário: manter updated_at atualizado
-- ---------------------------------------------------------------------
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

drop trigger if exists trg_kb_docs_updated_at on public.kb_docs;
create trigger trg_kb_docs_updated_at
    before update on public.kb_docs
    for each row execute function public.set_updated_at();

drop trigger if exists trg_kb_chunks_updated_at on public.kb_chunks;
create trigger trg_kb_chunks_updated_at
    before update on public.kb_chunks
    for each row execute function public.set_updated_at();

-- =====================================================================
-- FIM — 02_gmt_kb_schema.sql
-- Após aplicar: rodar a ingestão (ingest.py) para popular kb_docs/kb_chunks.
-- =====================================================================
