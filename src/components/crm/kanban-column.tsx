"use client";

import { useDroppable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import { leadStageLabel, type Lead, type LeadStage } from "@/lib/types/lead";
import { LeadCard } from "@/components/crm/lead-card";

const stageAccent: Record<LeadStage, string> = {
  novo: "border-t-status-available",
  contato_feito: "border-t-status-reserved",
  visita_agendada: "border-t-status-reserved",
  negociacao: "border-t-status-reserved",
  venda_fechada: "border-t-primary",
  perdido: "border-t-status-lost",
};

export function KanbanColumn({
  stage,
  leads,
  onSelectLead,
}: {
  stage: LeadStage;
  leads: Lead[];
  onSelectLead: (lead: Lead) => void;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "flex w-72 shrink-0 flex-col gap-3 rounded-lg border-t-4 bg-muted/30 p-3 transition-colors",
        stageAccent[stage],
        isOver && "bg-muted/60",
      )}
    >
      <div className="flex items-center justify-between px-1">
        <h3 className="text-sm font-semibold">{leadStageLabel[stage]}</h3>
        <span className="text-xs text-muted-foreground">{leads.length}</span>
      </div>
      <div className="flex min-h-16 flex-col gap-2">
        {leads.map((lead) => (
          <LeadCard
            key={lead.id}
            lead={lead}
            onClick={() => onSelectLead(lead)}
          />
        ))}
      </div>
    </div>
  );
}
