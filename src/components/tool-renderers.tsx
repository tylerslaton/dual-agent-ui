"use client";

import { DefaultToolCard } from "@/components/default-tool-card";
import { PieChart } from "@/components/pie-chart";
import { WeatherCard } from "@/components/weather";
import {
  useRenderToolCall,
  useDefaultTool,
} from "@copilotkit/react-core";

export function ToolRenderers() {
    // Default tool renderer for all other tools
    useDefaultTool({
      render: ({ args, name, result }) => (
        <DefaultToolCard name={name} args={args} result={result} />
      ),
    });
    
  // Register generative UI for the weather tool
  useRenderToolCall({
    name: "get_weather",
    description: "Get the weather for a given location.",
    parameters: [{ name: "location", type: "string", required: true }],
    render: ({ args }) => (
      <WeatherCard location={args.location} themeColor="black" />
    ),
  });

  // Register generative UI for the pie chart tool
  useRenderToolCall({
    name: "render_pie_chart",
    description: "Render a pie chart with the given data.",
    parameters: [
      { name: "title", type: "string", required: false },
      {
        name: "data",
        type: "object[]",
        required: true,
        description:
          "Array of data slices with label and value. Each slice has: label (string), value (number), color (optional string)",
      },
    ],
    render: ({ args }) => <PieChart title={args.title} data={args.data ?? []} />,
  });


  return null;
}
