"use client";

import { useState } from "react";
import Link from "next/link";
import { Car, Search } from "lucide-react";

import { formatCurrency, formatKm } from "@/lib/utils";
import type { VitrineVehicle } from "@/lib/types/vitrine";

export function VitrineGrid({
  slug,
  vehicles,
}: {
  slug: string;
  vehicles: VitrineVehicle[];
}) {
  const [query, setQuery] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  const filtered = vehicles.filter((vehicle) => {
    const matchesQuery = `${vehicle.brand} ${vehicle.model}`
      .toLowerCase()
      .includes(query.trim().toLowerCase());
    const matchesPrice = maxPrice ? vehicle.price <= Number(maxPrice) : true;
    return matchesQuery && matchesPrice;
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Buscar por marca ou modelo..."
            className="h-10 w-full rounded-lg border border-slate-200 bg-white pl-9 pr-3 text-sm outline-none focus:border-[#2596e0]"
          />
        </div>
        <input
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          type="number"
          placeholder="Preço máximo"
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#2596e0] sm:w-44"
        />
      </div>

      {filtered.length === 0 ? (
        <p className="py-16 text-center text-sm text-slate-500">
          Nenhum veículo encontrado com esses filtros.
        </p>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((vehicle) => (
            <Link
              key={vehicle.id}
              href={`/vitrine/${slug}/${vehicle.id}`}
              className="group overflow-hidden rounded-2xl border border-slate-200 bg-white transition-shadow hover:shadow-lg"
            >
              <div className="flex aspect-[4/3] w-full items-center justify-center bg-slate-100 text-slate-300">
                {vehicle.photos[0] ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={vehicle.photos[0]}
                    alt={`${vehicle.brand} ${vehicle.model}`}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <Car className="size-12" />
                )}
              </div>
              <div className="flex flex-col gap-1 p-4">
                <p className="truncate font-medium text-slate-900 group-hover:underline">
                  {vehicle.brand} {vehicle.model}
                </p>
                <p className="text-sm text-slate-500">
                  {vehicle.year} · {formatKm(vehicle.km)} · {vehicle.color}
                </p>
                <p className="mt-1 bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] bg-clip-text text-lg font-semibold text-transparent">
                  {formatCurrency(vehicle.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
