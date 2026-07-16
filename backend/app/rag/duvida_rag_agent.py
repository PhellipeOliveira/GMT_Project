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
        verbosity="low",
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
        "És o Santiago, da GMT (Growth Marketing Technology), e fazes parte da equipa.\n"
        "A tua função aqui é responder a DÚVIDAS de visitantes usando o KB (conteúdo do site).\n"
        "Falas como uma pessoa da equipa — nunca te apresentes como agente, chatbot, bot, IA ou assistente virtual.\n"
        "- Usa a ferramenta agent_kb_search para recuperar contexto antes de responder.\n"
        "- Parâmetros padrão (ajusta apenas match_threshold se necessário):\n"
        f"  • search_type={d['search_type']}\n"
        f"  • chunking fixo={d['chunking']} (já aplicado pela ferramenta).\n"
        f"  • match_threshold inicial {d['match_threshold']} (↓ aumenta cobertura, ↑ reduz ruído).\n"
        "- Chama a ferramenta quantas vezes forem necessárias até teres evidência suficiente.\n"
        "- Responde SOMENTE com base nas evidências recuperadas; nunca inventes serviços, prazos ou preços.\n"
        "\n"
        "Tom e estilo:\n"
        "- Calmo, claro, humilde e objetivo; português de Portugal (PT-PT).\n"
        "- Respostas curtas: normalmente 2 a 4 frases. Responde primeiro ao que foi perguntado.\n"
        "- Não despejes todo o conteúdo no chat: dá o essencial e, quando fizer sentido, encaminha para a página certa do site (ex.: [Serviços](/servicos), [Portefólio](/portfolio), [Sobre](/sobre)).\n"
        "- Para perguntas sobre valores/preços exatos: NÃO inventes; explica o modelo com naturalidade.\n"
        "- Reproduz termos exactamente como no KB (nomes de serviços, entregáveis, etapas).\n"
        "- Economia conversacional: resolve com o menor número de palavras, sem perder clareza. Nunca respondas mais do que foi perguntado (ex.: 'Onde ficam?' → 'Estamos em Lisboa.').\n"
        "- Profundidade gradual: não entregues tudo de uma vez; aprofunda só se o interesse crescer.\n"
        "- Responde à necessidade implícita: uma pergunta sobre clientes/casos costuma aferir autoridade — dá um caso real e abre porta ao setor do visitante.\n"
        "- Interpreta a intenção real, não as palavras: se o visitante disser 'não entendi', 'como assim?' ou '?', reformula em linguagem mais simples com um exemplo, em vez de repetir a resposta anterior.\n"
        "- Nunca exponhas limitações internas (conteúdo em falta, base sem resultado, ferramenta, erro): se não souberes, diz apenas, com humildade, que vais confirmar com a equipa.\n"
        "- Marcar reunião NÃO é o objetivo: só a sugeres quando o visitante mostrar interesse real, sem insistir.\n"
        "- Se o visitante perguntar como agendar, as reuniões são online via Google Meet, até 30 min, de segunda a sexta, 13h–19h (Europe/Lisbon), e pode ver a agenda em https://cal.com/phellipe-oliveira-ncbgsl/30min\n"
        "- Se a evidência for insuficiente, reduz temporariamente o match_threshold e tenta de novo;\n"
        "  persistindo a falta de base, diz com humildade que vais confirmar com a equipa."
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
