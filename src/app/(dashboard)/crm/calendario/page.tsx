import { VisitCalendar } from "@/components/crm/visit-calendar";
import { mockLeads } from "@/app/(dashboard)/crm/mock-data";

export default function CalendarioPage() {
  return <VisitCalendar leads={mockLeads} />;
}
