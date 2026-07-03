"""
Executor ReAct genérico (estado manual) para o Agente GMT.

Reutilizado pelos subgrafos: leads_agent, orcamentos_agent, reunioes_agent, duvidas_agent.
Fluxo: prepare -> agent -> tools -> agent (até não haver tool_calls).
"""

import json
from typing import Any, Dict, Iterable, Annotated, List, Optional
from typing_extensions import TypedDict

from langgraph.graph import END, StateGraph
from langgraph.graph.message import add_messages
from langgraph.prebuilt import ToolNode
from langchain_core.messages import (
    AIMessage,
    AnyMessage,
    BaseMessage,
    SystemMessage,
    ToolMessage,
)


# ── Estado MANUAL (TypedDict) ──
class AppState(TypedDict, total=False):
    messages: Annotated[List[AnyMessage], add_messages]
    react_prompt: str
    # Última saída (dict) de uma tool, propagada ao grafo pai (AgentState.tool_result)
    # para que `update_context` consiga consolidar `lead_atual`/`lead_id`.
    tool_result: Dict[str, Any]


def _parse_tool_content(content: Any) -> Optional[Dict[str, Any]]:
    """Converte o conteúdo de um ToolMessage no dict originalmente retornado pela tool.

    O ToolNode serializa retornos não-string via json.dumps; aqui desfazemos isso.
    """
    if isinstance(content, dict):
        return content
    if isinstance(content, str):
        try:
            parsed = json.loads(content)
        except Exception:
            return None
        return parsed if isinstance(parsed, dict) else None
    return None


# ── Fábrica do grafo ReAct ──
def create_react_executor(
    model,
    tools: Iterable,
    prompt: Optional[str] = None,
    prompt_vars: Optional[List[str]] = None,
):
    """Cria um executor ReAct: agent -> tools -> agent (até não haver tool_calls)."""
    tool_list = list(tools)
    tool_node = ToolNode(tool_list)
    bound_model = model.bind_tools(tool_list)

    def prepare(state: AppState):
        if not prompt:
            return {}
        prompt_text = prompt
        if prompt_vars:
            try:
                values = {k: state.get(k) for k in prompt_vars}
                prompt_text = prompt.format(**values)
            except Exception:
                prompt_text = prompt
        return {"react_prompt": prompt_text}

    def call_model(state: AppState):
        msgs = state["messages"]
        prompt_text = state.get("react_prompt") if isinstance(state, dict) else None
        if prompt_text:
            msgs = [SystemMessage(content=prompt_text), *msgs]
        response = bound_model.invoke(msgs)
        return {"messages": [response]}

    def run_tools(state: AppState):
        """Executa as tools e propaga o último resultado (dict) para `tool_result`.

        Sem isso, o retorno da tool (ex.: cadastrar_lead -> {"data": {"lead_id": ...}})
        ficaria preso apenas no ToolMessage e nunca chegaria ao grafo pai.
        """
        result = tool_node.invoke(state)
        updates = dict(result) if isinstance(result, dict) else {"messages": result}
        new_messages = updates.get("messages") or []
        for msg in reversed(new_messages):
            if isinstance(msg, ToolMessage):
                parsed = _parse_tool_content(msg.content)
                if isinstance(parsed, dict):
                    updates["tool_result"] = parsed
                    break
        return updates

    def should_continue(state: AppState) -> str:
        last: BaseMessage = state["messages"][-1]
        if isinstance(last, AIMessage) and getattr(last, "tool_calls", None):
            return "continue"
        return "end"

    graph = StateGraph(AppState)
    graph.add_node("agent", call_model)
    graph.add_node("prepare", prepare)
    graph.add_node("tools", run_tools)

    graph.set_entry_point("prepare" if prompt else "agent")
    graph.add_edge("prepare", "agent")
    graph.add_conditional_edges("agent", should_continue, {"continue": "tools", "end": END})
    graph.add_edge("tools", "agent")
    graph.set_finish_point("agent")
    return graph.compile()
