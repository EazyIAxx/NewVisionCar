import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Car } from "lucide-react";

import { formatCurrency, formatKm } from "@/lib/utils";
import { fetchVitrineVehicles } from "@/lib/data/vitrine";
import { fuelTypeLabel, transmissionLabel } from "@/lib/types/vitrine";
import { ProposalPanel } from "@/components/vitrine/proposal-panel";
import { FinancingSimulator } from "@/components/vitrine/financing-simulator";

export default async function VitrineVehicleDetailPage({
  params,
}: {
  params: Promise<{ slug: string; vehicleId: string }>;
}) {
  const { slug, vehicleId } = await params;
  const vehicles = await fetchVitrineVehicles(slug);
  const vehicle = vehicles.find((v) => v.id === vehicleId);

  if (!vehicle) {
    notFound();
  }

  const specs = [
    { label: "Ano", value: `${vehicle.year}/${vehicle.year}` },
    { label: "Câmbio", value: vehicle.transmission ? transmissionLabel[vehicle.transmission] : "—" },
    { label: "Combustível", value: vehicle.fuelType ? fuelTypeLabel[vehicle.fuelType] : "—" },
    { label: "Km", value: formatKm(vehicle.km) },
  ];

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <Link
        href={`/vitrine/${slug}`}
        className="mb-6 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-slate-900"
      >
        <ArrowLeft className="size-4" />
        Voltar pra vitrine
      </Link>

      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
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

          <div>
            <span className="inline-flex w-fit rounded-md bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] px-2 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
              {vehicle.brand}
            </span>
            <h1 className="mt-2 text-2xl font-bold tracking-tight text-slate-900">
              {vehicle.brand} {vehicle.model}
            </h1>
            <p className="text-sm text-slate-500">
              {vehicle.year} · {vehicle.color}
            </p>
            <p className="mt-2 bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] bg-clip-text text-3xl font-bold text-transparent">
              {formatCurrency(vehicle.price)}
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 rounded-xl border border-slate-200 p-4 sm:grid-cols-4">
            {specs.map((spec) => (
              <div key={spec.label}>
                <p className="text-xs text-slate-500">{spec.label}</p>
                <p className="font-semibold text-slate-900">{spec.value}</p>
              </div>
            ))}
          </div>

          {vehicle.features.length > 0 && (
            <div className="rounded-2xl border border-slate-200 p-6">
              <h2 className="mb-4 font-semibold text-slate-900">Opcionais</h2>
              <div className="flex flex-wrap gap-2">
                {vehicle.features.map((feature) => (
                  <span
                    key={feature}
                    className="rounded-full bg-slate-100 px-3 py-1 text-sm text-slate-600"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {vehicle.description && (
            <div className="rounded-2xl border border-slate-200 p-6">
              <h2 className="mb-3 font-semibold text-slate-900">
                Informações do veículo
              </h2>
              <p className="whitespace-pre-line text-sm leading-relaxed text-slate-600">
                {vehicle.description}
              </p>
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 lg:sticky lg:top-6 lg:self-start">
          <ProposalPanel vehicleId={vehicle.id} />
          <FinancingSimulator price={vehicle.price} />
        </div>
      </div>
    </div>
  );
}
