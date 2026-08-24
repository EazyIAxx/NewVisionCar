import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth/get-profile";
import { VitrineSettingsPanel } from "@/components/settings/vitrine/vitrine-settings-panel";
import { mockVitrineSettings } from "@/lib/mock/vitrine";

export default async function VitrineSettingsPage() {
  const profile = await getCurrentProfile();

  if (profile?.role !== "gestor" || !profile.agency_id) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Vitrine</h1>
        <p className="text-sm text-muted-foreground">
          Configure a página pública com o estoque disponível da sua revenda.
        </p>
      </div>
      <VitrineSettingsPanel initialSettings={mockVitrineSettings} />
    </div>
  );
}
