"use server";

import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export type OnboardingActionResult = { error: string | null };

export async function createAgencyAndSetGestor(
  name: string,
): Promise<OnboardingActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("create_agency_and_set_gestor", {
    p_name: name,
  });

  if (error) return { error: error.message };

  redirect("/dashboard");
}

export async function joinAgencyWithInvite(
  code: string,
): Promise<OnboardingActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("join_agency_with_invite", {
    p_code: code,
  });

  if (error) {
    if (error.message.includes("invalid_or_expired_invite")) {
      return { error: "Código de convite inválido ou expirado." };
    }
    return { error: error.message };
  }

  redirect("/dashboard");
}
