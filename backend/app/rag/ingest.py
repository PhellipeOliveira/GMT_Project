"""
Ingestão do KB do GMT: `.md` do site → chunks → embeddings → upsert no Supabase (Postgres + pgvector).

O conteúdo público do site GMT (Produto, Institucional, Serviços, FAQ, Políticas)
é o que alimenta o RAG do agente (intents `duvida_responder`).

Exporta um grafo `rag_ingest` (LangGraph) para acionar o pipeline no Studio.
"""

from typing import List, Dict, Any, Optional, TypedDict

from langchain_openai import OpenAIEmbeddings
from langgraph.graph import StateGraph

from app.rag.loaders import load_and_split_dir, split_text
from app.agent.tools import get_conn  # reutiliza a conexão com o Supabase
from json import dumps as json_dumps
import hashlib
from pathlib import Path
import mimetypes
import os


def vec_to_literal(v: List[float]) -> str:
    """Converte vetor de floats em literal aceito pelo pgvector: "[v1, v2, ...]"."""
    return "[" + ",".join(f"{x:.6f}" for x in v) + "]"


def embed_texts(texts: List[str]) -> List[List[float]]:
    """Gera embeddings para os textos (OpenAI)."""
    emb = OpenAIEmbeddings(model="text-embedding-3-small")
    return emb.embed_documents(texts)


def upsert_chunks(rows: List[Dict[str, Any]], *, categoria: Optional[str] = None) -> int:
    """Upsert idempotente por (doc_path, chunk_ix) na tabela rag_chunks do GMT.

    `categoria` permite segmentar o KB (ex.: 'produto', 'institucional', 'faq').
    """
    if not rows:
        return 0
    with get_conn() as conn:
        with conn.cursor() as cur:
            count = 0
            for r in rows:
                vec_lit = vec_to_literal(r["embedding"])
                cur.execute(
                    """
                    insert into public.rag_chunks (doc_path, chunk_ix, content, embedding, meta, categoria)
                    values (%s, %s, %s, %s::vector(1536), %s::jsonb, %s)
                    on conflict (doc_path, chunk_ix)
                    do update set content=excluded.content, embedding=excluded.embedding,
                                  meta=excluded.meta, categoria=excluded.categoria, updated_at=now()
                    """,
                    (
                        r["doc_path"],
                        r["chunk_ix"],
                        r["content"],
                        vec_lit,
                        json_dumps(r.get("meta") or {}),
                        categoria,
                    ),
                    prepare=False,
                )
                count += 1
    return count


def ingest_dir(
    base_dir: str = "docs_rag",
    *,
    strategy: str = "markdown",
    categoria: Optional[str] = None,
    chunk_size: int = 800,
    chunk_overlap: int = 200,
) -> int:
    """Pipeline direto: carrega .md do site, divide, embeda e upserta. Retorna total processado."""
    embedder = OpenAIEmbeddings(model="text-embedding-3-small") if strategy == "semantic" else None
    chunks = load_and_split_dir(
        base_dir, strategy=strategy, embedder=embedder, chunk_size=chunk_size, chunk_overlap=chunk_overlap
    )
    vectors = embed_texts([it["content"] for it in chunks])
    rows = []
    for it, vec in zip(chunks, vectors):
        it2 = dict(it)
        it2["embedding"] = vec
        rows.append(it2)
    return upsert_chunks(rows, categoria=categoria)


# ---- Staging (rag_docs) ----

def sha256_text(s: str) -> str:
    return hashlib.sha256(s.encode("utf-8")).hexdigest()


def stage_docs_from_dir(base_dir: str = "docs_rag", *, categoria: Optional[str] = None) -> int:
    """Lê arquivos .md do diretório e insere em rag_docs (staging), idempotente por (source_path, source_hash)."""
    base = Path(base_dir)
    files = sorted([p for p in base.rglob("*.md") if p.is_file()])
    if not files:
        return 0
    with get_conn() as conn:
        with conn.cursor() as cur:
            count = 0
            for path in files:
                text = path.read_text(encoding="utf-8")
                h = sha256_text(text)
                mime = mimetypes.guess_type(str(path))[0] or "text/markdown"
                cur.execute(
                    """
                    insert into public.rag_docs (source_path, source_hash, mime_type, content, meta, categoria)
                    values (%s, %s, %s, %s, %s::jsonb, %s)
                    on conflict (source_path, source_hash) do nothing
                    """,
                    (str(path.as_posix()), h, mime, text, json_dumps({}), categoria),
                    prepare=False,
                )
                count += 1
    return count


def truncate_kb_tables() -> None:
    """Trunca as tabelas do KB (staging e chunks). Use com cuidado: remove TODO o conteúdo."""
    with get_conn() as conn:
        conn.autocommit = True
        with conn.cursor() as cur:
            cur.execute("truncate table public.rag_chunks;")
            cur.execute("truncate table public.rag_docs;")


def materialize_chunks_from_staging(
    *,
    strategy: str = "markdown",
    categoria: Optional[str] = None,
    chunk_size: int = 800,
    chunk_overlap: int = 200,
) -> int:
    """Lê rag_docs (filtra por categoria) e materializa rag_chunks com a estratégia indicada.

    Idempotente por (doc_path, chunk_ix).
    """
    with get_conn() as conn:
        with conn.cursor() as cur:
            clauses, vals = [], []
            if categoria:
                clauses.append("lower(categoria) = lower(%s)")
                vals.append(categoria)
            where = (" where " + " and ".join(clauses)) if clauses else ""
            cur.execute(
                f"select id, source_path, content from public.rag_docs{where}",
                tuple(vals),
                prepare=False,
            )
            docs = cur.fetchall() or []
    if not docs:
        return 0

    embedder = OpenAIEmbeddings(model="text-embedding-3-small") if strategy == "semantic" else None
    rows: List[Dict[str, Any]] = []
    for _id, source_path, content in docs:
        chunks, resolved = split_text(
            content, strategy=strategy, embedder=embedder, chunk_size=chunk_size, chunk_overlap=chunk_overlap
        )
        for i, c in enumerate(chunks):
            rows.append(
                {
                    "doc_path": source_path,
                    "chunk_ix": i,
                    "content": c,
                    "meta": {"chunking": resolved},
                }
            )
    vectors = embed_texts([r["content"] for r in rows])
    for r, vec in zip(rows, vectors):
        r["embedding"] = vec
    return upsert_chunks(rows, categoria=categoria)


# ---- Grafo de ingestão (LangGraph / Studio) ----

class IngestState(TypedDict, total=False):
    base_dir: str
    strategy: str
    categoria: Optional[str]
    skip_stage: bool
    skip_chunks: bool
    staged: int
    chunked: int
    processed: int
    chunk_size: Optional[int]
    chunk_overlap: Optional[int]


def _resolve_base_dir(requested: Optional[str]) -> str:
    """Resolve o diretório do KB com fallback.

    Ordem: valor explícito → env BASE_DIR → 'docs_rag' no CWD → 'docs/site' relativo à raiz do repo.
    """
    def has_md(p: Path) -> bool:
        try:
            return p.exists() and any(p.rglob("*.md"))
        except Exception:
            return False

    if requested:
        p = Path(requested)
        if not p.is_absolute():
            p = Path.cwd() / p
        if has_md(p):
            return str(p)

    env_dir = os.getenv("BASE_DIR")
    if env_dir:
        p = Path(env_dir)
        if not p.is_absolute():
            p = Path.cwd() / p
        if has_md(p):
            return str(p)

    p_kb = Path.cwd() / "docs_rag"
    if has_md(p_kb):
        return str(p_kb)

    repo_root = Path(__file__).resolve().parents[2]
    p_site = repo_root / "docs" / "site"
    if has_md(p_site):
        return str(p_site)

    return requested or "docs_rag"


def node_stage(state: IngestState) -> IngestState:
    if state.get("skip_stage"):
        return {"staged": 0}
    base_dir = _resolve_base_dir(state.get("base_dir"))
    n = stage_docs_from_dir(base_dir, categoria=state.get("categoria"))
    return {"staged": n}


def node_chunk(state: IngestState) -> IngestState:
    if state.get("skip_chunks"):
        return {"chunked": 0, "processed": 0}
    strategy = str(state.get("strategy") or "markdown").strip().lower()
    kwargs: Dict[str, Any] = {"strategy": strategy, "categoria": state.get("categoria")}
    if isinstance(state.get("chunk_size"), int):
        kwargs["chunk_size"] = int(state["chunk_size"])
    if isinstance(state.get("chunk_overlap"), int):
        kwargs["chunk_overlap"] = int(state["chunk_overlap"])
    n = materialize_chunks_from_staging(**kwargs)
    return {"chunked": int(n or 0), "processed": int(n or 0)}


def compile_graph():
    g = StateGraph(IngestState)
    g.add_node("stage_docs", node_stage)
    g.add_node("chunk_docs", node_chunk)
    g.set_entry_point("stage_docs")
    g.add_edge("stage_docs", "chunk_docs")
    g.set_finish_point("chunk_docs")
    return g.compile()


graph = compile_graph()
