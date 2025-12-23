import json
from textwrap import dedent

# load environment variables
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from pydantic_ai.ag_ui import StateDeps
from pydantic_ai.models.openai import OpenAIResponsesModel

from pydantic_ai import Agent, RunContext

load_dotenv()


# =====
# State
# =====
class ProverbsState(BaseModel):
    """List of the proverbs being written."""

    proverbs: list[str] = Field(
        default_factory=list,
        description="The list of already written proverbs",
    )


# =====
# Agent
# =====
agent = Agent(
    model=OpenAIResponsesModel("gpt-4.1-mini"),
    deps_type=StateDeps[ProverbsState],
    system_prompt=dedent("""
    You are a helpful assistant that can help with weather, search, and data visualization.
  """).strip(),
)


# =====
# Tools
# =====
@agent.tool
def get_weather(_: RunContext[StateDeps[ProverbsState]], location: str) -> str:
    """Get the weather for a given location. Ensure location is fully spelled out."""
    return json.dumps({"temperature": 70, "condition": "Clear skies"})


@agent.tool
def search(_: RunContext[StateDeps[ProverbsState]], query: str) -> str:
    """
    Search the web for information.
    """
    import os

    from tavily import TavilyClient

    tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
    return json.dumps(tavily_client.search(query))


@agent.tool
def render_pie_chart(
    _: RunContext[StateDeps[ProverbsState]], title: str, data: list[dict]
) -> str:
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
