"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import type { FiscalSettings } from "@/lib/types/invoice";

export type ActionResult = { error: string | null };

export async function saveFiscalSettings(settings: FiscalSettings): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Sessão inválida." };

  const supabase = await createClient();
  const { error } = await supabase
    .from("agencies")
    .update({
      cnpj: settings.cnpj,
      inscricao_estadual: settings.inscricaoEstadual,
      inscricao_municipal: settings.inscricaoMunicipal,
      regime_tributario: settings.regime,
    })
    .eq("id", profile.agency_id);

  return { error: error?.message ?? null };
}
