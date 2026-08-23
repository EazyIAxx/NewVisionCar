import { KanbanBoard } from "@/components/crm/kanban-board";
import { NewLeadDialog } from "@/components/crm/new-lead-dialog";
import { mockLeads } from "@/app/(dashboard)/crm/mock-data";

export default function CrmPage() {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-end">
        <NewLeadDialog />
      </div>
      <KanbanBoard initialLeads={mockLeads} />
    </div>
  );
}
