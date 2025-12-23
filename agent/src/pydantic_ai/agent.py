import json
import time
from textwrap import dedent
from typing import Annotated

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
    time.sleep(1)

    return json.dumps(
        {
            "temperature": 70,
            "condition": "Clear skies",
            "humidity": 50,
            "windSpeed": 10,
            "feelsLike": 65,
        }
    )


@agent.tool
def search(_: RunContext[StateDeps[ProverbsState]], query: str) -> str:
    """
    Search the web for information.
    """
    import os

    from tavily import TavilyClient

    tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
    return json.dumps(tavily_client.search(query))


class PieSlice(BaseModel):
    """A single slice of a pie chart."""

    label: Annotated[str, Field(description="The label for this slice")]
    value: Annotated[float, Field(description="The numeric value for this slice")]
    color: Annotated[
        str | None,
        Field(
            default=None,
            description="A hex color like #3b82f6",
            pattern=r"^#[0-9a-fA-F]{6}$",
        ),
    ]


class PieChartParams(BaseModel):
    """Parameters for rendering a pie chart."""

    title: Annotated[
        str | None,
        Field(default=None, description="The title of the pie chart"),
    ]
    data: Annotated[
        list[PieSlice],
        Field(
            description="Array of data slices with label and value",
            min_length=1,
        ),
    ]


@agent.tool_plain
def render_pie_chart(params: PieChartParams) -> str:
    """Render a pie chart to visualize proportional data, percentages, or distributions."""
    return f"Rendered pie chart: {params.title or 'Untitled'} with {len(params.data)} slices"
