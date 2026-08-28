import { getCurrentProfile } from "@/lib/auth/get-profile";
import { VisitCalendar } from "@/components/crm/visit-calendar";
import { fetchLeads } from "@/lib/data/leads";

export default async function CalendarioPage() {
  const profile = await getCurrentProfile();
  const leads = await fetchLeads();
  return <VisitCalendar leads={leads} isGestor={profile?.role === "gestor"} />;
}
