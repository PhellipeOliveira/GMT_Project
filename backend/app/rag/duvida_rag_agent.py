"""
Agente de Dúvidas (RAG) — versão de teste isolada para o GMT.

Foco: responder perguntas de visitantes da landing page usando SOMENTE o KB
(conteúdo público do site: serviços, produtos, institucional, FAQ).
Sem ferramentas de lead/orçamento/reunião — apenas recuperação de contexto.

Corresponde à intent `duvida_responder` do Cheat Sheet do Agente GMT.
"""

from langchain_openai import ChatOpenAI
import os

from app.agent.new_react import create_react_executor
from app.rag.rag_tools import kb_search_gmt


def build_model():
    return ChatOpenAI(
        model=os.getenv("DUVIDA_LLM_MODEL", "gpt-5-nano"),
        output_version="responses/v1",
        reasoning={"effort": "high"},
        verbosity="medium",
    )


def defaults_kb() -> dict:
    return {
        "search_type": "hybrid_rrf",
        "chunking": "markdown",
        "use_hyde": False,
        "reranker": "none",
        "match_threshold": 0.5,
    }


def system_prompt() -> str:
    d = defaults_kb()
    return (
        "Você é o agente de recepção da GMT (agência de automação, IA e marketing) na landing page.\n"
        "Sua função aqui é responder DÚVIDAS de visitantes usando o KB (conteúdo do site).\n"
        "- Use a ferramenta agent_kb_search para recuperar contexto antes de responder.\n"
        "- Parâmetros padrão (ajuste apenas match_threshold se necessário):\n"
        f"  • search_type={d['search_type']}\n"
        f"  • chunking fixo={d['chunking']} (já aplicado pela ferramenta).\n"
        f"  • match_threshold inicial {d['match_threshold']} (↓ aumenta cobertura, ↑ reduz ruído).\n"
        "- Chame a ferramenta quantas vezes forem necessárias até ter evidência suficiente.\n"
        "- Responda SOMENTE com base nas evidências recuperadas; nunca invente serviços, prazos ou preços.\n"
        "\n"
        "Tom e estilo (recepção comercial da GMT):\n"
        "- Seja claro, acolhedor e objetivo; português do Brasil.\n"
        "- Para perguntas sobre valores/preços exatos: NÃO invente. Explique o modelo e ofereça agendar uma reunião.\n"
        "- Reproduza termos exatamente como no KB (nomes de serviços, entregáveis, etapas).\n"
        "- Ao final de uma resposta útil, ofereça o próximo passo (agendar reunião ou deixar contato).\n"
        "- Se a evidência for insuficiente, reduza temporariamente o match_threshold e tente de novo;\n"
        "  persistindo a falta de base, diga objetivamente que vai encaminhar a um especialista (escalar)."
    )


def build_agent_kb_tool():
    """Tool fina com chunking fixo; apenas match_threshold é variável (didático)."""
    from langchain_core.tools import tool

    d = defaults_kb()
    fixed_chunking = d["chunking"]
    fixed_search = d["search_type"]
    fixed_reranker = d["reranker"]

    @tool
    def agent_kb_search(query: str, k: int = 5, match_threshold: float | None = None):
        """Busca no KB do GMT com chunking fixo e threshold ajustável.

        - query: pergunta do visitante
        - k: top-K a retornar (default 5)
        - match_threshold: limiar de similaridade (float opcional)
        """
        args = {
            "query": query,
            "k": k,
            "search_type": fixed_search,
            "chunking": fixed_chunking,
            "reranker": fixed_reranker,
            "use_hyde": False,
        }
        if match_threshold is not None:
            try:
                args["match_threshold"] = float(match_threshold)
            except Exception:
                pass
        return kb_search_gmt.invoke(args)

    return agent_kb_search


def build_graph():
    tools = [build_agent_kb_tool()]
    return create_react_executor(
        build_model(),
        tools=tools,
        prompt=system_prompt(),
    )


graph = build_graph()
