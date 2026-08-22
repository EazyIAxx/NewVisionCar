import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth/get-profile";
import { VehicleForm } from "@/components/estoque/vehicle-form";
import { createVehicle } from "@/app/(dashboard)/estoque/actions";

export default async function NovoVeiculoPage() {
  const profile = await getCurrentProfile();
  if (!profile?.role) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight">Novo veículo</h1>
      <VehicleForm role={profile.role} mode="create" onSubmit={createVehicle} />
    </div>
  );
}
