"""
This is the main entry point for the agent.
It defines the workflow graph, state, tools, nodes and edges.
"""

from typing import Any

from langchain_core.messages import SystemMessage
from langchain_core.runnables import RunnableConfig
from langchain_core.tools import tool
from langchain_openai import ChatOpenAI
from langgraph.checkpoint.memory import MemorySaver
from langgraph.graph import END, MessagesState, StateGraph
from langgraph.prebuilt import ToolNode
from langgraph.types import Command
from typing_extensions import Literal

from .util import should_route_to_tool_node


class AgentState(MessagesState):
    run_count: int
    tools: list[Any]


@tool
def get_weather(location: str):
    """
    Get the weather for a given location. Whatever the user provides, always fully qualift the name.
    So SF becomes San Francisco, for example.
    """
    import json
    return json.dumps({"temperature": 70, "condition": "Clear skies"})


@tool
def search(query: str):
    """
    Search the web for information.
    """
    import os

    from tavily import TavilyClient

    tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
    return tavily_client.search(query)


@tool
def render_pie_chart(title: str, data: list[dict]):
    """
    Render a pie chart with the given data.
    Use this to visualize proportional data, percentages, or distributions.

    Args:
        title: The title of the pie chart
        data: A list of data slices. Each slice should have:
            - label (str): The label for this slice
            - value (number): The numeric value for this slice
            - color (str, optional): A hex color like "#3b82f6"
    """
    return f"Rendered pie chart: {title} with {len(data)} slices"


tools = [get_weather, search, render_pie_chart]


async def chat_node(
    state: AgentState, config: RunnableConfig
) -> Command[Literal["tool_node", "__end__"]]:
    """
    Standard Chat node for interacting with the user.
    """

    model = ChatOpenAI(model="gpt-4o")
    fe_tools = state.get("tools", [])
    model_with_tools = model.bind_tools(
        [
            *fe_tools,
            *tools,
        ],
    )

    # 3. Define the system message by which the chat model will be run
    system_message = SystemMessage(
        content=f"You are a helpful assistant. The current proverbs are {state.get('proverbs', [])}."
    )

    # 4. Run the model to generate a response
    response = await model_with_tools.ainvoke(
        [
            system_message,
            *state["messages"],
        ],
        config,
    )

    # 5. Check if the model wants to call any tools
    tool_calls = response.tool_calls
    if tool_calls and should_route_to_tool_node(tool_calls, fe_tools):
        return Command(goto="tool_node", update={"messages": response})

    # 6. No tool calls, so we can end the graph.
    return Command(
        goto=END,
        update={"messages": response, "run_count": state.get("run_count", 0) + 1},
    )


# Define the workflow graph
workflow = StateGraph(AgentState)
workflow.add_node("chat_node", chat_node)
workflow.add_node("tool_node", ToolNode(tools))
workflow.add_edge("tool_node", "chat_node")
workflow.set_entry_point("chat_node")

checkpointer = MemorySaver()
graph = workflow.compile(checkpointer=checkpointer)
