"use server";

import type { AgentConfig } from "@/lib/types/whatsapp-agent";

export type ActionResult = { error: string | null };

// TODO(M8 backend): substituir por update real em `agencies`/`whatsapp_agent_config`.
export async function saveAgentConfig(config: AgentConfig): Promise<ActionResult> {
  console.log("save whatsapp agent config (mock)", config);
  return { error: null };
}
