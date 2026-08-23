import Link from "next/link";
import { Plus } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import { VehicleCard } from "@/components/estoque/vehicle-card";
import { VehicleFilters } from "@/components/estoque/vehicle-filters";
import { updateVehicleStatus } from "@/app/(dashboard)/estoque/actions";
import type { Vehicle } from "@/lib/types/vehicle";

type SearchParams = Promise<{ q?: string; status?: string; precoMax?: string }>;

export default async function EstoquePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { q, status, precoMax } = await searchParams;

  const supabase = await createClient();
  let query = supabase
    .from("vehicles_view")
    .select("*")
    .order("created_at", { ascending: false });

  if (q) {
    query = query.or(`brand.ilike.%${q}%,model.ilike.%${q}%`);
  }
  if (status) {
    query = query.eq("status", status);
  }
  if (precoMax) {
    query = query.lte("price", Number(precoMax));
  }

  const { data: rows, error } = await query;

  const vehicles: Vehicle[] = (rows ?? []).map((row) => ({
    // As colunas da view vêm tipadas como nullable (comportamento padrão do
    // gerador de tipos para views), mas todas exceto cost_price/photos são
    // NOT NULL na tabela base `vehicles`.
    id: row.id!,
    brand: row.brand!,
    model: row.model!,
    year: row.year!,
    plate: row.plate!,
    color: row.color!,
    km: row.km!,
    price: Number(row.price),
    costPrice: row.cost_price === null ? null : Number(row.cost_price),
    status: row.status as Vehicle["status"],
    photos: row.photos ?? [],
  }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold tracking-tight">Estoque</h1>
        <Button
          render={<Link href="/estoque/novo" />}
          nativeButton={false}
          className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
        >
          <Plus />
          Novo veículo
        </Button>
      </div>

      <VehicleFilters defaultValues={{ q, status, precoMax }} />

      {error ? (
        <p className="py-12 text-center text-sm text-destructive">
          Não foi possível carregar o estoque: {error.message}
        </p>
      ) : vehicles.length === 0 ? (
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
