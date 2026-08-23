import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth/get-profile";
import { AgentConfigPanel } from "@/components/settings/whatsapp/agent-config-panel";
import { mockAgentConfig } from "@/lib/mock/whatsapp-agent";

export default async function WhatsappAgentPage() {
  const profile = await getCurrentProfile();

  if (profile?.role !== "gestor" || !profile.agency_id) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">BIA</h1>
        <p className="text-sm text-muted-foreground">
          Configure como sua assistente de IA atende os leads no WhatsApp.
        </p>
      </div>
      <AgentConfigPanel initialConfig={mockAgentConfig} />
    </div>
  );
}
