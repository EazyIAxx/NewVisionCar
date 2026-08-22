import { notFound, redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import { VehicleForm } from "@/components/estoque/vehicle-form";
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
      <h1 className="text-2xl font-semibold tracking-tight">
        Editar veículo
      </h1>
      <VehicleForm
        role={profile.role}
        mode="edit"
        initialValues={vehicle}
        onSubmit={updateVehicle.bind(null, vehicle.id)}
      />
    </div>
  );
}
