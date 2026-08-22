import { Search } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { vehicleStatusLabel } from "@/lib/types/vehicle";

export function VehicleFilters({
  defaultValues,
}: {
  defaultValues: { q?: string; status?: string; precoMax?: string };
}) {
  return (
    <form
      method="get"
      className="flex flex-col gap-3 sm:flex-row sm:items-end sm:gap-4"
    >
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          name="q"
          defaultValue={defaultValues.q}
          placeholder="Buscar por marca ou modelo..."
          className="pl-9"
        />
      </div>
      <select
        name="status"
        defaultValue={defaultValues.status ?? ""}
        className="h-8 rounded-md border border-input bg-transparent px-3 text-sm dark:bg-input/30"
      >
        <option value="">Todos os status</option>
        {Object.entries(vehicleStatusLabel).map(([value, label]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      <Input
        name="precoMax"
        type="number"
        defaultValue={defaultValues.precoMax}
        placeholder="Preço máximo"
        className="sm:w-40"
      />
      <Button type="submit" variant="secondary" className="cursor-pointer">
        Filtrar
      </Button>
    </form>
  );
}
