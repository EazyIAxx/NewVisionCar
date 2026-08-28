"use client";

import { useState } from "react";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import { toast } from "sonner";

import { leadStageOrder, type Lead, type LeadStage } from "@/lib/types/lead";
import { updateLeadStage } from "@/app/(dashboard)/crm/actions";
import { KanbanColumn } from "@/components/crm/kanban-column";
import { LeadDetailDialog } from "@/components/crm/lead-detail-dialog";

export function KanbanBoard({ initialLeads }: { initialLeads: Lead[] }) {
  const [leads, setLeads] = useState(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over) return;

    const leadId = String(active.id);
    const newStage = over.id as LeadStage;
    const lead = leads.find((l) => l.id === leadId);
    if (!lead || lead.stage === newStage) return;

    const previousStage = lead.stage;
    setLeads((prev) =>
      prev.map((l) => (l.id === leadId ? { ...l, stage: newStage } : l)),
    );

    updateLeadStage(leadId, newStage).then((result) => {
      if (result?.error) {
        setLeads((prev) =>
          prev.map((l) =>
            l.id === leadId ? { ...l, stage: previousStage } : l,
          ),
        );
        toast.error(result.error);
      } else if (newStage === "visita_agendada" && !lead.visitDate) {
        // Ainda não tem data/hora marcada — abre o detalhe já pedindo isso,
        // em vez de deixar a visita "agendada" sem horário nenhum.
        setSelectedLead({ ...lead, stage: newStage });
      }
    });
  }

  return (
    <>
      <DndContext id="crm-kanban" sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {leadStageOrder.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              leads={leads.filter((lead) => lead.stage === stage)}
              onSelectLead={setSelectedLead}
            />
          ))}
        </div>
      </DndContext>

      {selectedLead && (
        <LeadDetailDialog
          lead={selectedLead}
          open={!!selectedLead}
          onOpenChange={(open) => {
            if (!open) setSelectedLead(null);
          }}
        />
      )}
    </>
  );
}
