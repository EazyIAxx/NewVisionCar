"use client";

import { useState } from "react";
import { format, isSameDay } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarClock } from "lucide-react";

import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Lead } from "@/lib/types/lead";

export function VisitCalendar({ leads }: { leads: Lead[] }) {
  const visits = leads.filter(
    (lead): lead is Lead & { visitDate: string } => !!lead.visitDate,
  );
  const visitDates = visits.map((visit) => new Date(visit.visitDate));

  const [selected, setSelected] = useState<Date | undefined>(
    visitDates[0] ?? new Date(),
  );

  const visitsOnSelectedDay = selected
    ? visits.filter((visit) => isSameDay(new Date(visit.visitDate), selected))
    : [];

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <Card className="w-fit">
        <CardContent>
          <Calendar
            mode="single"
            locale={ptBR}
            defaultMonth={selected}
            selected={selected}
            onSelect={setSelected}
            modifiers={{ hasVisit: visitDates }}
            modifiersClassNames={{
              hasVisit:
                "after:absolute after:bottom-1 after:left-1/2 after:size-1 after:-translate-x-1/2 after:rounded-full after:bg-primary",
            }}
          />
        </CardContent>
      </Card>

      <div className="flex flex-1 flex-col gap-3">
        <h3 className="text-sm font-medium text-muted-foreground">
          {selected
            ? `Visitas em ${format(selected, "d 'de' MMMM", { locale: ptBR })}`
            : "Selecione um dia"}
        </h3>
        {visitsOnSelectedDay.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhuma visita agendada para esse dia.
          </p>
        )}
        {visitsOnSelectedDay.map((visit) => (
          <Card key={visit.id}>
            <CardContent className="flex items-center gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                <CalendarClock className="size-4" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{visit.name}</p>
                <p className="truncate text-sm text-muted-foreground">
                  {visit.vehicleInterest} · {visit.vendedorName}
                </p>
              </div>
              <Badge variant="secondary">
                {format(new Date(visit.visitDate), "HH:mm")}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
