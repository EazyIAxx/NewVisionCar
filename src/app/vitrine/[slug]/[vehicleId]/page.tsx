import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, CalendarDays, Car, Gauge, Palette } from "lucide-react";

import { formatCurrency, formatKm } from "@/lib/utils";
import { mockVitrineVehicles } from "@/lib/mock/vitrine";
import { InterestFormDialog } from "@/components/vitrine/interest-form-dialog";

export default async function VitrineVehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string; vehicleId: string }>;
}) {
  const { slug, vehicleId } = await params;
  const vehicle = mockVitrineVehicles.find((v) => v.id === vehicleId);

  if (!vehicle) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <Link
        href={`/vitrine/${slug}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Voltar pra vitrine
      </Link>

      <div className="grid gap-8 sm:grid-cols-2">
        <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-2xl bg-slate-100 text-slate-300">
          {vehicle.photos[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={vehicle.photos[0]}
              alt={`${vehicle.brand} ${vehicle.model}`}
              className="h-full w-full object-cover"
            />
          ) : (
            <Car className="size-16" />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="mt-1 bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] bg-clip-text text-3xl font-bold text-transparent">
              {formatCurrency(vehicle.price)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CalendarDays className="size-4" /> {vehicle.year}
            </div>
            <div className="flex items-center gap-2">
              <Gauge className="size-4" /> {formatKm(vehicle.km)}
            </div>
            <div className="flex items-center gap-2">
              <Palette className="size-4" /> {vehicle.color}
            </div>
          </div>

          <InterestFormDialog
            vehicleId={vehicle.id}
            vehicleLabel={`${vehicle.brand} ${vehicle.model}`}
          />
        </div>
      </div>
    </div>
  );
}
