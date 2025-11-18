"use client";

import { ArrowUp } from "lucide-react";

export function ChatInput({
  message,
  onMessageChange,
  onSend,
}: {
  message: string;
  onMessageChange: (message: string) => void;
  onSend: () => void;
}) {
  return (
    <div className="p-4">
      <div className="max-w-4xl mx-auto">
        <div className="relative flex items-center bg-white border border-gray-300 rounded-full shadow-sm hover:shadow-md transition-shadow">
          <textarea
            className="flex-1 resize-none p-4 pr-12 focus:outline-none min-h-[56px] max-h-[200px]"
            placeholder="Message both agents..."
            value={message}
            onChange={(e) => onMessageChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                onSend();
              }
            }}
            rows={1}
          />
          <button
            onClick={onSend}
            disabled={!message.trim()}
            className="absolute right-3 p-2 rounded-full bg-black text-white disabled:bg-gray-200 disabled:text-gray-400 hover:bg-gray-800 transition-colors"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
