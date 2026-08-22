"use client";

import { useState, useTransition } from "react";
import { Check, ChevronDown } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { vehicleStatusLabel, type VehicleStatus } from "@/lib/types/vehicle";

const statusOptions: VehicleStatus[] = ["disponivel", "reservado", "vendido"];

export function StatusQuickMenu({
  vehicleId,
  status,
  onChange,
}: {
  vehicleId: string;
  status: VehicleStatus;
  onChange: (
    vehicleId: string,
    status: VehicleStatus,
  ) => Promise<{ error: string | null }>;
}) {
  const [current, setCurrent] = useState(status);
  const [isPending, startTransition] = useTransition();

  function handleSelect(next: VehicleStatus) {
    if (next === current) return;
    const previous = current;
    setCurrent(next);
    startTransition(async () => {
      const result = await onChange(vehicleId, next);
      if (result?.error) {
        setCurrent(previous);
        toast.error(result.error);
      } else {
        toast.success(`Status atualizado para ${vehicleStatusLabel[next]}`);
      }
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="cursor-pointer"
            disabled={isPending}
          />
        }
      >
        {vehicleStatusLabel[current]}
        <ChevronDown className="size-3.5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {statusOptions.map((option) => (
          <DropdownMenuItem
            key={option}
            onClick={() => handleSelect(option)}
            className="cursor-pointer justify-between"
          >
            {vehicleStatusLabel[option]}
            {option === current && <Check className="size-4" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
