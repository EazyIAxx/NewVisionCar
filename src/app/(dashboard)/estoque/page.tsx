import Link from "next/link";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/estoque/vehicle-card";
import { VehicleFilters } from "@/components/estoque/vehicle-filters";
import { updateVehicleStatus } from "@/app/(dashboard)/estoque/actions";
import { mockVehicles } from "@/app/(dashboard)/estoque/mock-data";

type SearchParams = Promise<{ q?: string; status?: string; precoMax?: string }>;

export default async function EstoquePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, status, precoMax } = await searchParams;

  const vehicles = mockVehicles.filter((vehicle) => {
    if (q) {
      const term = q.toLowerCase();
      const matches =
        vehicle.brand.toLowerCase().includes(term) ||
        vehicle.model.toLowerCase().includes(term);
      if (!matches) return false;
    }
    if (status && vehicle.status !== status) return false;
    if (precoMax && vehicle.price > Number(precoMax)) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Estoque</h1>
        <Button
          render={<Link href="/estoque/novo" />}
          nativeButton={false}
          className="cursor-pointer"
        >
          <Plus />
          Novo veículo
        </Button>
      </div>

      <VehicleFilters defaultValues={{ q, status, precoMax }} />

      {vehicles.length === 0 ? (
        <p className="py-12 text-center text-sm text-muted-foreground">
          Nenhum veículo encontrado com esses filtros.
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {vehicles.map((vehicle) => (
            <VehicleCard
              key={vehicle.id}
              vehicle={vehicle}
              onStatusChange={updateVehicleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
