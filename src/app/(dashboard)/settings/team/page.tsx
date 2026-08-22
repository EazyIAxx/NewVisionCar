import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth/get-profile";
import { createClient } from "@/lib/supabase/server";
import { TeamPanel, type Member } from "@/components/settings/team-panel";

export default async function TeamPage() {
  const profile = await getCurrentProfile();

  if (profile?.role !== "gestor" || !profile.agency_id) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data: members } = await supabase
    .from("profiles")
    .select("id, full_name, email, role")
    .eq("agency_id", profile.agency_id)
    .order("created_at", { ascending: true });

  return <TeamPanel initialMembers={(members ?? []) as Member[]} />;
}
