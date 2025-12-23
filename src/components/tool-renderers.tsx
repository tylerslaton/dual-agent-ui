"use client";

import { DefaultToolCard } from "@/components/default-tool-card";
import { WeatherCard } from "@/components/weather";
import {
  useRenderToolCall as useCopilotAction,
  useDefaultTool,
} from "@copilotkit/react-core";

export function ToolRenderers() {
  // Register generative UI for the weather tool
  useCopilotAction({
    name: "get_weather",
    description: "Get the weather for a given location.",
    parameters: [{ name: "location", type: "string", required: true }],
    render: ({ args }) => (
      <WeatherCard location={args.location} themeColor="black" />
    ),
  });

  // Default tool renderer for all other tools
  useDefaultTool({
    render: ({ args, name, result }) => (
      <DefaultToolCard name={name} args={args} result={result} />
    ),
  });

  return null;
}
