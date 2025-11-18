"use client";

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
      <details className="border border-gray-300 rounded-lg overflow-hidden">
        <summary className="cursor-pointer p-3 bg-gray-50 hover:bg-gray-100 transition-colors font-medium text-sm">
          {name}
        </summary>
        <div className="p-3 bg-white border-t border-gray-200 space-y-2">
          {args && (
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">
                Arguments:
              </div>
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                {JSON.stringify(args, null, 2)}
              </pre>
            </div>
          )}
          {result && (
            <div>
              <div className="text-xs font-semibold text-gray-600 mb-1">
                Result:
              </div>
              <pre className="text-xs bg-gray-50 p-2 rounded overflow-auto">
                {JSON.stringify(result, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </details>
    ),
  });

  return null;
}
