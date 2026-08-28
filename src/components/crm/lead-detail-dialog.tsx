"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarClock, Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  leadActivityTypeLabel,
  leadOriginLabel,
  leadStageLabel,
  type Lead,
  type LeadActivity,
} from "@/lib/types/lead";
import { addLeadActivity, scheduleVisit } from "@/app/(dashboard)/crm/actions";

function toDatetimeLocalValue(isoDate: string | null): string {
  if (!isoDate) return "";
  const date = new Date(isoDate);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export function LeadDetailDialog({
  lead,
  open,
  onOpenChange,
}: {
  lead: Lead;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const router = useRouter();
  const [activities, setActivities] = useState<LeadActivity[]>(lead.activities);
  const [note, setNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visitDateInput, setVisitDateInput] = useState(toDatetimeLocalValue(lead.visitDate));
  const [isSchedulingVisit, setIsSchedulingVisit] = useState(false);

  async function handleScheduleVisit() {
    setIsSchedulingVisit(true);
    const isoDate = visitDateInput ? new Date(visitDateInput).toISOString() : null;
    const result = await scheduleVisit(lead.id, isoDate);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(isoDate ? "Visita agendada" : "Data de visita removida");
      router.refresh();
    }
    setIsSchedulingVisit(false);
  }

  async function handleAddNote() {
    if (!note.trim()) return;
    setIsSubmitting(true);
    const result = await addLeadActivity(lead.id, {
      type: "nota",
      description: note,
    });
    if (result?.error) {
      toast.error(result.error);
    } else {
      setActivities((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          type: "nota",
          description: note,
          date: new Date().toISOString(),
        },
      ]);
      setNote("");
      toast.success("Interação registrada");
    }
    setIsSubmitting(false);
  }

  const sorted = [...activities].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{lead.name}</DialogTitle>
          <DialogDescription>
            {lead.phone}
            {lead.email ? ` · ${lead.email}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{leadOriginLabel[lead.origin]}</Badge>
          <Badge variant="secondary">{leadStageLabel[lead.stage]}</Badge>
          {lead.vehicleInterest && (
            <Badge variant="secondary">{lead.vehicleInterest}</Badge>
          )}
        </div>

        <Field>
          <FieldLabel htmlFor="visitDate" className="flex items-center gap-1.5">
            <CalendarClock className="size-3.5" /> Data e hora da visita
          </FieldLabel>
          <div className="flex gap-2">
            <Input
              id="visitDate"
              type="datetime-local"
              value={visitDateInput}
              onChange={(e) => setVisitDateInput(e.target.value)}
            />
            <Button
              onClick={handleScheduleVisit}
              disabled={isSchedulingVisit}
              variant="outline"
              className="shrink-0 cursor-pointer"
            >
              {isSchedulingVisit ? <Loader2 className="animate-spin" /> : "Salvar"}
            </Button>
          </div>
        </Field>

        <div className="flex max-h-60 flex-col gap-3 overflow-y-auto pr-1">
          {sorted.length === 0 && (
            <p className="text-sm text-muted-foreground">
              Nenhuma interação registrada.
            </p>
          )}
          {sorted.map((activity) => (
            <div key={activity.id} className="border-l-2 pl-3 text-sm">
              <p className="font-medium">
                {leadActivityTypeLabel[activity.type]}
              </p>
              <p className="text-muted-foreground">{activity.description}</p>
              <p className="text-xs text-muted-foreground">
                {format(new Date(activity.date), "d 'de' MMM 'às' HH:mm", {
                  locale: ptBR,
                })}
              </p>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Adicionar nota..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleAddNote();
              }
            }}
          />
          <Button
            onClick={handleAddNote}
            disabled={isSubmitting}
            className="shrink-0 cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
          >
            {isSubmitting ? (
              <Loader2 className="animate-spin" />
            ) : (
              <Send />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
