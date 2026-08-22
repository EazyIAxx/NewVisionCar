import "server-only";

import { createClient } from "@/lib/supabase/server";

export type Profile = {
  id: string;
  agency_id: string | null;
  role: "gestor" | "vendedor" | null;
  full_name: string | null;
  email: string | null;
};

export async function getCurrentProfile(): Promise<Profile | null> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, agency_id, role, full_name, email")
    .eq("id", user.id)
    .single();

  // `role` é um check constraint ('gestor' | 'vendedor'), não um enum do
  // Postgres — `supabase gen types` não consegue restringir a literal union.
  return profile as Profile | null;
}
