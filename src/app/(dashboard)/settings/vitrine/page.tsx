import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import { VitrineSettingsPanel } from "@/components/settings/vitrine/vitrine-settings-panel";
import type { VitrineSettings } from "@/lib/types/vitrine";

export default async function VitrineSettingsPage() {
  const profile = await getCurrentProfile();

  if (profile?.role !== "gestor" || !profile.agency_id) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data: agency } = await supabase
    .from("agencies")
    .select("name, slug, vitrine_accent_color, vitrine_whatsapp")
    .eq("id", profile.agency_id)
    .single();

  const initialSettings: VitrineSettings = {
    displayName: agency?.name ?? "",
    slug: agency?.slug ?? "",
    accentColor: agency?.vitrine_accent_color ?? "#2596e0",
    whatsapp: agency?.vitrine_whatsapp ?? "",
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Vitrine</h1>
        <p className="text-sm text-muted-foreground">
          Configure a página pública com o estoque disponível da sua revenda.
        </p>
      </div>
      <VitrineSettingsPanel initialSettings={initialSettings} />
    </div>
  );
}
