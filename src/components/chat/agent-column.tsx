"use client";

import { useRef, useEffect } from "react";
import { Streamdown } from "streamdown";

export function AgentColumn({
  title,
  agent,
  renderToolCall,
}: {
  title: string;
  agent: any;
  renderToolCall: any;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [agent.messages]);

  return (
    <div className="flex flex-col h-full min-h-0 bg-white rounded-lg shadow-sm border border-gray-200">
      <div className="flex-shrink-0 border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto p-4 space-y-4">
        {agent.messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-400">
            No messages yet
          </div>
        ) : (
          agent.messages
            .filter((message: any) => message.role !== "tool")
            .map((message: any) => (
              <div key={message.id} className="space-y-4">
                <div
                  className={`rounded-2xl px-4 py-2 ${message.role === "user" ? "bg-gray-100 ml-auto w-fit" : "mr-auto"}`}
                >
                  <Streamdown>{message.content}</Streamdown>
                </div>

                {message.role === "assistant" &&
                  message.toolCalls?.map((toolCall: any) => (
                    <div key={toolCall.id}>{renderToolCall({ toolCall })}</div>
                  ))}
              </div>
            ))
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}

