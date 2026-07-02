"""
Ferramentas RAG do GMT: `kb_search_gmt` com busca parametrizável e reranking opcional.

O KB do GMT é único (uma empresa). Segmentamos por `categoria`
(ex.: 'produto', 'institucional', 'faq') em vez de client_id/empresa multi-tenant.
"""

from typing import Any, Dict, List, Optional
import os

from langchain_core.tools import tool
from langchain_openai import OpenAIEmbeddings, ChatOpenAI

from app.agent.tools import get_conn


def vec_to_literal(v: List[float]) -> str:
    return "[" + ",".join(f"{x:.6f}" for x in v) + "]"


def query_candidates(
    query: str,
    k: int,
    search_type: str,
    categoria: Optional[str],
    chunking: Optional[str],
    query_embedding: Optional[List[float]],
    match_threshold: Optional[float],
) -> List[Dict[str, Any]]:
    """Obtém candidatos do Supabase conforme o tipo de busca.

    Retorna dicts com doc_path, chunk_ix, content, score, meta.
    """
    params: Dict[str, Any] = {
        "k": k,
        "categoria": categoria,
        "chunking": chunking,
        "query": query,
        "threshold": match_threshold,
    }
    with get_conn() as conn:
        with conn.cursor() as cur:
            results: List[Dict[str, Any]] = []
            if search_type == "vector":
                if not query_embedding:
                    raise RuntimeError("search_type=vector requer embedding da query")
                cur.execute(
                    "select doc_path, chunk_ix, content, score, meta from public.kb_vector_search(%(vec)s, %(k)s, %(threshold)s, %(categoria)s, %(chunking)s)",
                    {**params, "vec": vec_to_literal(query_embedding)},
                )
            elif search_type == "text":
                cur.execute(
                    "select doc_path, chunk_ix, content, score, meta from public.kb_text_search(%(query)s, %(k)s, %(categoria)s, %(chunking)s)",
                    params,
                )
            elif search_type in ("hybrid", "hybrid_rrf"):
                if query_embedding is None:
                    raise RuntimeError("search_type=hybrid requer embedding da query")
                cur.execute(
                    "select doc_path, chunk_ix, content, score, meta from public.kb_hybrid_search(%(query)s, %(vec)s, %(k)s, %(threshold)s, %(categoria)s, %(chunking)s)",
                    {**params, "vec": vec_to_literal(query_embedding)},
                )
            else:
                raise RuntimeError(f"search_type inválido: {search_type}")

            for row in cur.fetchall() or []:
                results.append(
                    {
                        "doc_path": row[0],
                        "chunk_ix": row[1],
                        "content": row[2],
                        "score": float(row[3]) if row[3] is not None else None,
                        "meta": row[4] or {},
                    }
                )
            return results


def apply_rerank(query: str, items: List[Dict[str, Any]], reranker: str, k: int) -> List[Dict[str, Any]]:
    if reranker == "none" or not items:
        return items[:k]
    if reranker == "cohere":
        try:
            from langchain_cohere import CohereRerank
        except Exception as e:
            raise RuntimeError("Reranker 'cohere' solicitado, mas langchain-cohere não está disponível") from e
        if not os.getenv("COHERE_API_KEY"):
            raise RuntimeError("Reranker 'cohere' solicitado, mas COHERE_API_KEY não está definido")
        reranker_model = CohereRerank(model="rerank-multilingual-v3.0")  # multilingual: PT-BR/PT-PT
        docs = [it["content"] for it in items]
        results = None
        if hasattr(reranker_model, "rerank"):
            results = reranker_model.rerank(query=query, documents=docs)
        elif hasattr(reranker_model, "rank"):
            results = reranker_model.rank(query=query, documents=docs)
        if isinstance(results, list) and results:
            from collections import defaultdict, deque

            def _content(obj):
                d = getattr(obj, "document", None)
                if d is not None:
                    return getattr(d, "page_content", None) or getattr(d, "text", None) or str(d)
                if isinstance(obj, dict):
                    dd = obj.get("document") or obj
                    return dd.get("text") or dd.get("page_content") or str(dd)
                return getattr(obj, "page_content", None) or getattr(obj, "text", None) or ""

            idx_map = defaultdict(deque)
            for i, d in enumerate(docs):
                idx_map[d].append(i)
            ordered = []
            for r in results:
                c = str(_content(r))
                if c in idx_map and idx_map[c]:
                    ordered.append(items[idx_map[c].popleft()])
            if ordered:
                return ordered[:k]
        return items[:k]
    return items[:k]


def hyde(query: str) -> str:
    """Gera um documento hipotético (HyDE) para expandir a consulta sobre serviços/produtos do GMT."""
    llm = ChatOpenAI(model=(os.getenv("HYDE_LLM_MODEL") or "gpt-4o-mini"), temperature=0.3)
    prompt = (
        "Escreva um parágrafo conciso que seria altamente relevante para responder à pergunta a seguir,"
        " no contexto de uma agência de automação, IA e marketing (GMT).\nPergunta: " + query
    )
    return (llm.invoke(prompt).content or "").strip()


@tool
def kb_search_gmt(
    query: str,
    k: int = 5,
    search_type: str = "hybrid",
    reranker: str = "none",
    rerank_candidates: int = 24,
    categoria: Optional[str] = None,
    chunking: Optional[str] = None,
    use_hyde: bool = False,
    match_threshold: Optional[float] = None,
) -> List[Dict[str, Any]]:
    """Busca no KB do GMT (conteúdo do site) com filtros e reranking opcional.

    - `categoria`: restringe a busca (produto/institucional/faq). None = KB inteiro.
    - Usada pela intent `duvida_responder` para fundamentar respostas sem inventar.
    """
    query_emb: Optional[List[float]] = None
    if search_type != "text":
        emb = OpenAIEmbeddings(model="text-embedding-3-small")
        q = hyde(query) if use_hyde else query
        query_emb = emb.embed_query(q)

    candidates = query_candidates(
        query,
        rerank_candidates or k,
        search_type,
        categoria,
        chunking,
        query_emb,
        match_threshold,
    )
    return apply_rerank(query, candidates, reranker, k)
