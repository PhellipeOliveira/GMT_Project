"""
Carregadores e splitters para os documentos .md do KB do GMT.

O KB é alimentado pelo conteúdo público do site:
- Produto_Conteudo_Publico_do_Site.md
- Institucional_Conteudo_Publico_do_Site.md
(e outros .md de serviços, FAQ, políticas, etc.)

Regras:
- KISS/YAGNI: três estratégias de chunking (fixed, markdown, semantic).
- Comentários em português para favorecer o entendimento humano.
"""

import re
from pathlib import Path
from typing import List, Dict, Any, Tuple, Optional

from langchain_text_splitters import (
    RecursiveCharacterTextSplitter,
    MarkdownHeaderTextSplitter,
)

# Suporte a SemanticChunker em múltiplos pacotes (compat):
_HAS_SEMANTIC = False
SemanticChunker = None  # type: ignore
try:
    from langchain_text_splitters import SemanticChunker as _SC  # type: ignore
    SemanticChunker = _SC  # type: ignore
    _HAS_SEMANTIC = True
except Exception:
    try:
        from langchain_experimental.text_splitter import SemanticChunker as _SC  # type: ignore
        SemanticChunker = _SC  # type: ignore
        _HAS_SEMANTIC = True
    except Exception:
        SemanticChunker = None  # type: ignore
        _HAS_SEMANTIC = False


def list_md_files(base_dir: str | Path) -> List[Path]:
    """Lista arquivos .md recursivamente a partir de base_dir."""
    base = Path(base_dir)
    return sorted([p for p in base.rglob("*.md") if p.is_file()])


def read_text(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def split_fixed(text: str, chunk_size: int = 800, chunk_overlap: int = 200) -> List[str]:
    splitter = RecursiveCharacterTextSplitter(
        chunk_size=chunk_size,
        chunk_overlap=chunk_overlap,
        length_function=len,
    )
    return splitter.split_text(text)


# Remove emoji/decoração no início de um cabeçalho (mantém letras acentuadas).
_LEADING_DECOR = re.compile(r"^[^0-9A-Za-zÀ-ÿ]+")


def _clean_crumb(s: str) -> str:
    return _LEADING_DECOR.sub("", (s or "").strip()).strip()


def split_markdown(text: str, *, chunk_size: int = 800, chunk_overlap: int = 200) -> List[str]:
    """Markdown awareness: divide por cabeçalhos (bom para o conteúdo estruturado do site GMT).

    Preserva o caminho de cabeçalhos como prefixo de cada chunk
    (ex.: 'AGENTES DE IA > Hospitalidade > Reservas via WhatsApp'), para que a
    categoria (##) e o nome (###) fiquem no texto vetorizado e melhorem a recuperação.
    """
    splitter = MarkdownHeaderTextSplitter(
        headers_to_split_on=[("#", "h1"), ("##", "h2"), ("###", "h3")]
    )
    docs = splitter.split_text(text)
    chunks: List[str] = []
    for d in docs:
        crumbs = [_clean_crumb(d.metadata.get(k, "")) for k in ("h1", "h2", "h3")]
        breadcrumb = " > ".join(c for c in crumbs if c)
        corpo = (d.page_content or "").strip()
        if breadcrumb and corpo:
            chunks.append(f"{breadcrumb}\n\n{corpo}")
        elif breadcrumb:
            chunks.append(breadcrumb)
        elif corpo:
            chunks.append(corpo)
    return chunks


def split_semantic(text: str, embedder=None) -> List[str]:
    """Semantic chunking orientado por embeddings (sem fallback)."""
    if not _HAS_SEMANTIC:
        raise RuntimeError("SemanticChunker não está disponível no ambiente")
    if embedder is None:
        raise RuntimeError("Semantic chunking requer 'embedder' válido (ex.: OpenAIEmbeddings)")
    splitter = SemanticChunker(embedder, breakpoint_threshold_type="interquartile")
    return splitter.split_text(text)


def split_text(
    text: str,
    strategy: str = "markdown",
    *,
    embedder=None,
    chunk_size: int = 800,
    chunk_overlap: int = 200,
) -> Tuple[List[str], str]:
    """Divide texto em chunks conforme a estratégia. Retorna (chunks, strategy_resolvida).

    Default 'markdown': o conteúdo do site GMT é bem estruturado em cabeçalhos.
    """
    s = (strategy or "").lower()
    if not s:
        raise RuntimeError("Estratégia de chunking não informada (fixed/markdown/semantic)")
    if s == "fixed":
        return split_fixed(text, chunk_size, chunk_overlap), "fixed"
    if s == "markdown":
        return split_markdown(text, chunk_size=chunk_size, chunk_overlap=chunk_overlap), "markdown"
    if s == "semantic":
        return split_semantic(text, embedder), "semantic"
    raise RuntimeError(f"Estratégia de chunking inválida: {strategy}")


def load_and_split_dir(
    base_dir: str | Path,
    strategy: str = "markdown",
    *,
    embedder=None,
    chunk_size: int = 800,
    chunk_overlap: int = 200,
) -> List[Dict[str, Any]]:
    """Carrega todos os .md do diretório do KB e retorna chunks com metadados.

    Saída: [{doc_path, chunk_ix, content, meta}]
    """
    items: List[Dict[str, Any]] = []
    for path in list_md_files(base_dir):
        text = read_text(path)
        chunks, resolved = split_text(
            text, strategy, embedder=embedder, chunk_size=chunk_size, chunk_overlap=chunk_overlap
        )
        for i, c in enumerate(chunks):
            items.append(
                {
                    "doc_path": str(path.as_posix()),
                    "chunk_ix": i,
                    "content": c,
                    "meta": {"chunking": resolved},
                }
            )
    return items
