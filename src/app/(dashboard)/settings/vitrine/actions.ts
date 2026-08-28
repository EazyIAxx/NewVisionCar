"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import type { VitrineSettings } from "@/lib/types/vitrine";

export type ActionResult = { error: string | null };

export async function saveVitrineSettings(settings: VitrineSettings): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Sessão inválida." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("agencies")
    .update({
      name: settings.displayName,
      slug: settings.slug,
      vitrine_accent_color: settings.accentColor,
      vitrine_whatsapp: settings.whatsapp || null,
    })
    .eq("id", profile.agency_id);

  if (error?.code === "23505") {
    return { error: "Esse endereço de vitrine já está em uso. Escolha outro." };
  }

  return { error: error?.message ?? null };
}
