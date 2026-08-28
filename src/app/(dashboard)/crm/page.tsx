import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import { fetchLeads } from "@/lib/data/leads";
import { KanbanBoard } from "@/components/crm/kanban-board";
import { NewLeadDialog } from "@/components/crm/new-lead-dialog";

export default async function CrmPage() {
  const profile = await getCurrentProfile();
  const leads = await fetchLeads();

  const supabase = await createClient();
  const { data: members } = profile?.agency_id
    ? await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("agency_id", profile.agency_id)
        .eq("role", "vendedor")
        .order("full_name", { ascending: true })
    : { data: null };

  const vendedores = (members ?? [])
    .filter((m): m is { id: string; full_name: string } => !!m.full_name)
    .map((m) => ({ id: m.id, fullName: m.full_name }));

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <NewLeadDialog vendedores={vendedores} currentProfileId={profile?.id ?? ""} />
      </div>
      <KanbanBoard
        initialLeads={leads}
        vendedores={vendedores}
        isGestor={profile?.role === "gestor"}
      />
    </div>
  );
}
