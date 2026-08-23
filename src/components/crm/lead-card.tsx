"use client";

import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { leadOriginLabel, type Lead } from "@/lib/types/lead";

export function LeadCard({
  lead,
  onClick,
}: {
  lead: Lead;
  onClick: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: lead.id });

  return (
    <Card
      ref={setNodeRef}
      style={{ transform: CSS.Translate.toString(transform) }}
      {...listeners}
      {...attributes}
      onClick={onClick}
      className={cn(
        "cursor-grab gap-2 p-3 active:cursor-grabbing",
        isDragging && "z-10 opacity-50",
      )}
    >
      <p className="text-sm font-medium">{lead.name}</p>
      {lead.vehicleInterest && (
        <p className="truncate text-xs text-muted-foreground">
          {lead.vehicleInterest}
        </p>
      )}
      <div className="flex items-center justify-between gap-2">
        <Badge variant="secondary" className="text-[10px]">
          {leadOriginLabel[lead.origin]}
        </Badge>
        <span className="truncate text-[10px] text-muted-foreground">
          {lead.vendedorName}
        </span>
      </div>
    </Card>
  );
}
