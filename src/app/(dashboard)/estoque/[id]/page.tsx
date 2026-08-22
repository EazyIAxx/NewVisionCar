import { notFound, redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth/get-profile";
import { VehicleForm } from "@/components/estoque/vehicle-form";
import { updateVehicle } from "@/app/(dashboard)/estoque/actions";
import { mockVehicles } from "@/app/(dashboard)/estoque/mock-data";

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

  // TODO(M2 backend): buscar o veículo real na tabela `vehicles` (respeitando RLS por agency_id).
  const vehicle = mockVehicles.find((v) => v.id === id);
  if (!vehicle) {
    notFound();
  }

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
