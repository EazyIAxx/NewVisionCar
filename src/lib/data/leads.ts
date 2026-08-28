import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Lead, LeadActivity } from "@/lib/types/lead";

export async function fetchLeads(): Promise<Lead[]> {
  const supabase = await createClient();
  const [{ data: leadRows }, { data: activityRows }] = await Promise.all([
    supabase
      .from("leads")
      .select("*, profiles(full_name)")
      .order("created_at", { ascending: false }),
    supabase.from("lead_activities").select("*").order("date", { ascending: true }),
  ]);

  const activitiesByLeadId = new Map<string, LeadActivity[]>();
  for (const row of activityRows ?? []) {
    const list = activitiesByLeadId.get(row.lead_id) ?? [];
    list.push({
      id: row.id,
      type: row.type as LeadActivity["type"],
      description: row.description,
      date: row.date,
    });
    activitiesByLeadId.set(row.lead_id, list);
  }

  return (leadRows ?? []).map((row) => ({
    id: row.id,
    name: row.name,
    phone: row.phone,
    email: row.email,
    origin: row.origin as Lead["origin"],
    vehicleInterest: row.vehicle_interest,
    stage: row.stage as Lead["stage"],
    vendedorId: row.vendedor_id,
    vendedorName: (row.profiles as { full_name: string | null } | null)?.full_name ?? null,
    createdByAi: row.created_by_ai,
    visitDate: row.visit_date,
    createdAt: row.created_at,
    activities: activitiesByLeadId.get(row.id) ?? [],
  }));
}
