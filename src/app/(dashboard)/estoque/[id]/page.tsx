import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import { Button } from "@/components/ui/button";
import { VehicleForm } from "@/components/estoque/vehicle-form";
import { ListingPublisher } from "@/components/estoque/listing-publisher";
import { ServiceOrdersPanel } from "@/components/estoque/service-orders-panel";
import { FinancingSimulatorPanel } from "@/components/estoque/financing-simulator-panel";
import { DeleteVehicleButton } from "@/components/estoque/delete-vehicle-button";
import { updateVehicle } from "@/app/(dashboard)/estoque/actions";
import type { Vehicle } from "@/lib/types/vehicle";

export default async function EditarVeiculoPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getCurrentProfile();
  if (!profile?.role) {
    redirect("/login");
  }

  const supabase = await createClient();
  const { data: row } = await supabase
    .from("vehicles_view")
    .select("*")
    .eq("id", id)
    .single();

  if (!row) {
    notFound();
  }

  const vehicle: Vehicle = {
    // Colunas da view vêm tipadas como nullable, mas são NOT NULL na tabela
    // base `vehicles` (exceto cost_price/photos).
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
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="cursor-pointer"
            render={<Link href="/estoque" />}
            nativeButton={false}
            aria-label="Voltar para o estoque"
          >
            <ArrowLeft />
          </Button>
          <h1 className="text-2xl font-semibold tracking-tight">
            Editar veículo
          </h1>
        </div>
        <DeleteVehicleButton
          vehicleId={vehicle.id}
          vehicleLabel={`${vehicle.brand} ${vehicle.model}`}
        />
      </div>
      <VehicleForm
        role={profile.role}
        mode="edit"
        initialValues={vehicle}
        onSubmit={updateVehicle.bind(null, vehicle.id)}
      />
      <ListingPublisher vehicleId={vehicle.id} />
      <ServiceOrdersPanel vehicleId={vehicle.id} />
      <FinancingSimulatorPanel price={vehicle.price} />
    </div>
  );
}
