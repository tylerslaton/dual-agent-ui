import json
from textwrap import dedent

from ag_ui.core import EventType, StateSnapshotEvent

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
    You are a helpful assistant that helps manage and discuss proverbs.

    The user has a list of proverbs that you can help them manage.
    You have tools available to add, set, or retrieve proverbs from the list.

    When discussing proverbs, ALWAYS use the get_proverbs tool to see the current list before
    mentioning, updating, or discussing proverbs with the user.
  """).strip(),
)


# =====
# Tools
# =====
@agent.tool
def get_proverbs(ctx: RunContext[StateDeps[ProverbsState]]) -> list[str]:
    """Get the current list of proverbs."""
    print(f"📖 Getting proverbs: {ctx.deps.state.proverbs}")
    return ctx.deps.state.proverbs


@agent.tool
async def add_proverbs(
    ctx: RunContext[StateDeps[ProverbsState]], proverbs: list[str]
) -> StateSnapshotEvent:
    ctx.deps.state.proverbs.extend(proverbs)
    return StateSnapshotEvent(
        type=EventType.STATE_SNAPSHOT,
        snapshot=ctx.deps.state,
    )


@agent.tool
async def set_proverbs(
    ctx: RunContext[StateDeps[ProverbsState]], proverbs: list[str]
) -> StateSnapshotEvent:
    ctx.deps.state.proverbs = proverbs
    return StateSnapshotEvent(
        type=EventType.STATE_SNAPSHOT,
        snapshot=ctx.deps.state,
    )


@agent.tool
def get_weather(_: RunContext[StateDeps[ProverbsState]], location: str) -> str:
    """Get the weather for a given location. Ensure location is fully spelled out."""
    return f"The weather in {location} is sunny."


@agent.tool
def search(_: RunContext[StateDeps[ProverbsState]], query: str) -> str:
    """
    Search the web for information.
    """
    import os

    from tavily import TavilyClient

    tavily_client = TavilyClient(api_key=os.getenv("TAVILY_API_KEY"))
    return json.dumps(tavily_client.search(query))
