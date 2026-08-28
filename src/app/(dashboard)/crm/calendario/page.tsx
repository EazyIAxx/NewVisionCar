import { VisitCalendar } from "@/components/crm/visit-calendar";
import { fetchLeads } from "@/lib/data/leads";

export default async function CalendarioPage() {
  const leads = await fetchLeads();
  return <VisitCalendar leads={leads} />;
}
