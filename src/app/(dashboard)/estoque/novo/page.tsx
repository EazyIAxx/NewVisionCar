import Link from "next/link";
import { redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { getCurrentProfile } from "@/lib/auth/get-profile";
import { Button } from "@/components/ui/button";
import { VehicleForm } from "@/components/estoque/vehicle-form";
import { createVehicle } from "@/app/(dashboard)/estoque/actions";

export default async function NovoVeiculoPage() {
  const profile = await getCurrentProfile();
  if (!profile?.role) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-6">
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
        <h1 className="text-2xl font-semibold tracking-tight">Novo veículo</h1>
      </div>
      <VehicleForm role={profile.role} mode="create" onSubmit={createVehicle} />
    </div>
  );
}
