"use client";

import { DefaultToolCard } from "@/components/tools/default-tool-card";
import { PieChart } from "@/components/tools/pie-chart";
import { WeatherCard } from "@/components/tools/weather";
import { useDefaultTool, useRenderToolCall } from "@copilotkit/react-core";
import { useFrontendTool } from "@copilotkit/react-core/v2";
import { z } from "zod";

export function ToolRenderers() {
  // Default tool renderer for all other tools
  useDefaultTool({
    render: ({ args, name, result }) => (
      <DefaultToolCard name={name} args={args} result={result} />
    ),
  });

  // Render backend weather tool with custom UI
  useRenderToolCall({
    name: "get_weather",
    description: "Get the weather for a given location.",
    parameters: [
      { name: "location", type: "string", description: "The location to get weather for" },
    ],
    render: (props) => {
      const { args } = props;
      return <WeatherCard location={args.location as string} themeColor="black" />;
    },
  });

  // Register generative UI for the pie chart tool
  useFrontendTool({
    name: "render_pie_chart",
    description: "Render a pie chart with the given data. you MUST!!! provide the data to be rendered.",
    parameters: z.object({
      title: z.string().optional().describe("The title of the pie chart"),
      data: z.array(
        z.object({
          label: z.string().describe("The label for this slice"),
          value: z.number().describe("The numeric value for this slice"),
          color: z.string().optional().describe("A hex color like #3b82f6"),
        })
      ).describe("Array of data slices with label and value"),
    }),
    render: ({ args }) => (
      <PieChart title={args.title} data={args.data ?? []} />
    ),
    handler: async ({ title, data }) => {
      return { title, data };
    },
  });

  return null;
}

