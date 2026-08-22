"use server";

import { createClient } from "@/lib/supabase/server";

export type GenerateInviteResult = {
  code: string | null;
  error: string | null;
};

export async function generateInviteCode(): Promise<GenerateInviteResult> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .rpc("create_agency_invite", { p_role: "vendedor" })
    .single();

  if (error) return { code: null, error: error.message };

  return { code: (data as { code: string }).code, error: null };
}
