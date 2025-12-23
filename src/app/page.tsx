import { ToolRenderers } from "@/components/tool-renderers";
import { DualAgentChat } from "@/components/chat/dual-agent-chat";

export default function Home() {
  return (
    <main className="h-screen bg-gray-50">
      <ToolRenderers />
      <DualAgentChat />
    </main>
  );
}
