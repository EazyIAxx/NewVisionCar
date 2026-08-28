"use client";

import { useMemo, useState } from "react";
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

type Vendedor = { id: string; fullName: string };

const UNASSIGNED_FILTER = "nao_atribuido";
const ALL_FILTER = "todos";

export function KanbanBoard({
  initialLeads,
  vendedores,
  isGestor,
}: {
  initialLeads: Lead[];
  vendedores: Vendedor[];
  isGestor: boolean;
}) {
  const [leads, setLeads] = useState(initialLeads);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [vendedorFilter, setVendedorFilter] = useState(ALL_FILTER);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
  );

  const filteredLeads = useMemo(() => {
    if (vendedorFilter === ALL_FILTER) return leads;
    if (vendedorFilter === UNASSIGNED_FILTER) {
      return leads.filter((lead) => !lead.vendedorId);
    }
    return leads.filter((lead) => lead.vendedorId === vendedorFilter);
  }, [leads, vendedorFilter]);

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

  function handleDeleted(leadId: string) {
    setLeads((prev) => prev.filter((l) => l.id !== leadId));
    setSelectedLead(null);
  }

  return (
    <>
      <div className="flex items-center gap-2">
        <label htmlFor="vendedorFilter" className="text-sm text-muted-foreground">
          Vendedor:
        </label>
        <select
          id="vendedorFilter"
          value={vendedorFilter}
          onChange={(e) => setVendedorFilter(e.target.value)}
          className="h-8 rounded-md border border-input bg-transparent px-3 text-sm dark:bg-input/30"
        >
          <option value={ALL_FILTER}>Todos</option>
          <option value={UNASSIGNED_FILTER}>Não atribuído</option>
          {vendedores.map((vendedor) => (
            <option key={vendedor.id} value={vendedor.id}>
              {vendedor.fullName}
            </option>
          ))}
        </select>
      </div>

      <DndContext id="crm-kanban" sensors={sensors} onDragEnd={handleDragEnd}>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {leadStageOrder.map((stage) => (
            <KanbanColumn
              key={stage}
              stage={stage}
              leads={filteredLeads.filter((lead) => lead.stage === stage)}
              onSelectLead={setSelectedLead}
            />
          ))}
        </div>
      </DndContext>

      {selectedLead && (
        <LeadDetailDialog
          lead={selectedLead}
          open={!!selectedLead}
          isGestor={isGestor}
          onOpenChange={(open) => {
            if (!open) setSelectedLead(null);
          }}
          onDeleted={handleDeleted}
        />
      )}
    </>
  );
}
