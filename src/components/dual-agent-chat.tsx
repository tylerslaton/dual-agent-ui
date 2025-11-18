"use client";

import { useState } from "react";
import { useAgent, useRenderToolCall } from "@copilotkit/react-core/v2";
import { AgentColumn } from "./agent-column";
import { ChatInput } from "./chat-input";

export function DualAgentChat() {
  const [message, setMessage] = useState("");

  // Connect to both agents - that's it!
  const { agent: langgraph } = useAgent({ agentId: "langgraph" });
  const { agent: pydantic } = useAgent({ agentId: "pydantic" });

  const renderToolCall = useRenderToolCall();

  if (!langgraph || !pydantic) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  const sendMessage = () => {
    if (!message.trim()) return;

    // Send message to both agents
    [langgraph, pydantic].forEach((agent) => {
      agent.addMessage({
        id: crypto.randomUUID(),
        role: "user",
        content: message,
      });
      agent.runAgent();
    });

    setMessage("");
  };

  return (
    <div className="flex flex-col h-screen max-h-screen">
      {/* Agent columns */}
      <div className="flex-1 min-h-0 grid grid-cols-2 gap-4 p-4">
        <AgentColumn
          title="LangGraph"
          agent={langgraph}
          renderToolCall={renderToolCall}
        />
        <AgentColumn
          title="Pydantic AI"
          agent={pydantic}
          renderToolCall={renderToolCall}
        />
      </div>

      {/* Input */}
      <ChatInput
        message={message}
        onMessageChange={setMessage}
        onSend={sendMessage}
      />
    </div>
  );
}
