"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  addMonths,
  addWeeks,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
  subMonths,
  subWeeks,
} from "date-fns";
import { ptBR } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import type { Lead } from "@/lib/types/lead";
import { LeadDetailDialog } from "@/components/crm/lead-detail-dialog";

type CalendarView = "semana" | "mes";
type VisitLead = Lead & { visitDate: string };

const START_HOUR = 8;
const END_HOUR = 19;
const HOUR_HEIGHT = 56; // px

export function VisitCalendar({ leads, isGestor }: { leads: Lead[]; isGestor: boolean }) {
  const router = useRouter();
  const visits = useMemo(
    () => leads.filter((lead): lead is VisitLead => !!lead.visitDate),
    [leads],
  );

  const [view, setView] = useState<CalendarView>("semana");
  const [current, setCurrent] = useState<Date>(() =>
    visits[0] ? new Date(visits[0].visitDate) : new Date(),
  );
  const [selectedLead, setSelectedLead] = useState<VisitLead | null>(null);

  function goPrev() {
    setCurrent((prev) => (view === "semana" ? subWeeks(prev, 1) : subMonths(prev, 1)));
  }
  function goNext() {
    setCurrent((prev) => (view === "semana" ? addWeeks(prev, 1) : addMonths(prev, 1)));
  }

  const periodLabel =
    view === "semana" ? formatWeekLabel(current) : format(current, "MMMM 'de' yyyy", { locale: ptBR });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            onClick={goPrev}
            aria-label="Período anterior"
          >
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="cursor-pointer"
            onClick={goNext}
            aria-label="Próximo período"
          >
            <ChevronRight />
          </Button>
          <Button variant="outline" className="cursor-pointer" onClick={() => setCurrent(new Date())}>
            Hoje
          </Button>
          <Popover>
            <PopoverTrigger
              render={
                <button
                  type="button"
                  className="ml-2 cursor-pointer rounded-md px-2 py-1 text-lg font-semibold capitalize hover:bg-muted"
                />
              }
            >
              {periodLabel}
            </PopoverTrigger>
            <PopoverContent align="start" className="w-auto p-0">
              <Calendar
                mode="single"
                locale={ptBR}
                captionLayout="dropdown"
                defaultMonth={current}
                selected={current}
                onSelect={(date) => date && setCurrent(date)}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex gap-1 rounded-lg border p-1">
          <button
            type="button"
            onClick={() => setView("semana")}
            className={cn(
              "cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              view === "semana"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            Semana
          </button>
          <button
            type="button"
            onClick={() => setView("mes")}
            className={cn(
              "cursor-pointer rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              view === "mes"
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted",
            )}
          >
            Mês
          </button>
        </div>
      </div>

      {view === "semana" ? (
        <WeekView current={current} visits={visits} onSelectVisit={setSelectedLead} />
      ) : (
        <MonthView current={current} visits={visits} onSelectVisit={setSelectedLead} />
      )}

      {selectedLead && (
        <LeadDetailDialog
          lead={selectedLead}
          open={!!selectedLead}
          isGestor={isGestor}
          onOpenChange={(open) => {
            if (!open) setSelectedLead(null);
          }}
          onDeleted={() => {
            setSelectedLead(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

function formatWeekLabel(date: Date) {
  const start = startOfWeek(date, { locale: ptBR });
  const end = endOfWeek(date, { locale: ptBR });
  if (isSameMonth(start, end)) {
    return `${format(start, "d")} – ${format(end, "d 'de' MMMM 'de' yyyy", { locale: ptBR })}`;
  }
  return `${format(start, "d 'de' MMM")} – ${format(end, "d 'de' MMM 'de' yyyy", { locale: ptBR })}`;
}

function VisitChip({ visit, onSelect }: { visit: VisitLead; onSelect: (visit: VisitLead) => void }) {
  return (
    <button
      type="button"
      onClick={() => onSelect(visit)}
      className="w-full cursor-pointer truncate rounded-md bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] px-1.5 py-1 text-left text-[11px] font-medium text-white transition-transform hover:scale-[1.02]"
    >
      {format(new Date(visit.visitDate), "HH:mm")} · {visit.name}
    </button>
  );
}

function WeekView({
  current,
  visits,
  onSelectVisit,
}: {
  current: Date;
  visits: VisitLead[];
  onSelectVisit: (visit: VisitLead) => void;
}) {
  const start = startOfWeek(current, { locale: ptBR });
  const end = endOfWeek(current, { locale: ptBR });
  const days = eachDayOfInterval({ start, end });

  const weekVisits = visits.filter((visit) => {
    const date = new Date(visit.visitDate);
    return date >= start && date <= end;
  });
  // A faixa de horas se ajusta pra caber qualquer agendamento fora do
  // horário comercial padrão, em vez de escondê-lo silenciosamente.
  const startHour = Math.min(START_HOUR, ...weekVisits.map((v) => new Date(v.visitDate).getHours()));
  const endHour = Math.max(
    END_HOUR,
    ...weekVisits.map((v) => new Date(v.visitDate).getHours() + 1),
  );
  const hours = Array.from({ length: endHour - startHour }, (_, i) => startHour + i);

  return (
    <div className="overflow-x-auto rounded-xl border">
      <div className="grid grid-cols-[56px_repeat(7,minmax(120px,1fr))] border-b">
        <div />
        {days.map((day) => (
          <div
            key={day.toISOString()}
            className={cn(
              "flex flex-col items-center gap-0.5 border-l px-2 py-2 text-center",
              isToday(day) && "bg-primary/5",
            )}
          >
            <span className="text-xs text-muted-foreground capitalize">
              {format(day, "EEE", { locale: ptBR })}
            </span>
            <span
              className={cn(
                "flex size-7 items-center justify-center rounded-full text-sm font-medium",
                isToday(day) && "bg-primary text-primary-foreground",
              )}
            >
              {format(day, "d")}
            </span>
          </div>
        ))}
      </div>

      <div className="relative grid grid-cols-[56px_repeat(7,minmax(120px,1fr))]">
        <div className="flex flex-col">
          {hours.map((hour) => (
            <div
              key={hour}
              style={{ height: HOUR_HEIGHT }}
              className="flex items-start justify-end border-t pr-2 text-xs text-muted-foreground"
            >
              <span className="-translate-y-1/2">{hour}:00</span>
            </div>
          ))}
        </div>

        {days.map((day) => (
          <div key={day.toISOString()} className="relative border-l">
            {hours.map((hour) => (
              <div key={hour} style={{ height: HOUR_HEIGHT }} className="border-t" />
            ))}
            {visits
              .filter((visit) => isSameDay(new Date(visit.visitDate), day))
              .map((visit) => {
                const visitDate = new Date(visit.visitDate);
                const hour = visitDate.getHours();
                const minutes = visitDate.getMinutes();
                const top = (hour - startHour + minutes / 60) * HOUR_HEIGHT;
                return (
                  <button
                    key={visit.id}
                    type="button"
                    onClick={() => onSelectVisit(visit)}
                    style={{ top, height: HOUR_HEIGHT - 4 }}
                    className="absolute inset-x-1 cursor-pointer overflow-hidden rounded-md bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] p-1.5 text-left text-xs text-white shadow-sm transition-transform hover:scale-[1.02]"
                  >
                    <p className="truncate font-medium">
                      {format(visitDate, "HH:mm")} · {visit.name}
                    </p>
                    <p className="truncate opacity-80">{visit.vehicleInterest}</p>
                  </button>
                );
              })}
          </div>
        ))}
      </div>
    </div>
  );
}

function MonthView({
  current,
  visits,
  onSelectVisit,
}: {
  current: Date;
  visits: VisitLead[];
  onSelectVisit: (visit: VisitLead) => void;
}) {
  const start = startOfWeek(startOfMonth(current), { locale: ptBR });
  const end = endOfWeek(endOfMonth(current), { locale: ptBR });
  const days = eachDayOfInterval({ start, end });
  const weekdayLabels = eachDayOfInterval({ start, end: endOfWeek(start, { locale: ptBR }) });

  return (
    <div className="overflow-hidden rounded-xl border">
      <div className="grid grid-cols-7 border-b bg-muted/30">
        {weekdayLabels.map((day) => (
          <div
            key={day.toISOString()}
            className="px-2 py-2 text-center text-xs font-medium text-muted-foreground capitalize"
          >
            {format(day, "EEE", { locale: ptBR })}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7">
        {days.map((day) => {
          const dayVisits = visits
            .filter((visit) => isSameDay(new Date(visit.visitDate), day))
            .sort((a, b) => (a.visitDate < b.visitDate ? -1 : 1));
          const inMonth = isSameMonth(day, current);
          return (
            <div
              key={day.toISOString()}
              className={cn(
                "flex min-h-[110px] flex-col gap-1 border-t border-l p-1.5",
                !inMonth && "bg-muted/20",
              )}
            >
              <span
                className={cn(
                  "flex size-6 items-center justify-center self-end rounded-full text-xs",
                  !inMonth && "text-muted-foreground",
                  isToday(day) && "bg-primary text-primary-foreground",
                )}
              >
                {format(day, "d")}
              </span>
              <div className="flex flex-col gap-1">
                {dayVisits.map((visit) => (
                  <VisitChip key={visit.id} visit={visit} onSelect={onSelectVisit} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
