"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Car, Search } from "lucide-react";

import { formatCurrency, formatKm } from "@/lib/utils";
import type { VitrineVehicle } from "@/lib/types/vitrine";

type SortOption = "relevancia" | "menor_preco" | "maior_preco" | "az";

const sortLabel: Record<SortOption, string> = {
  relevancia: "Relevância",
  menor_preco: "Menor preço",
  maior_preco: "Maior preço",
  az: "A a Z",
};

export function VitrineGrid({
  slug,
  vehicles,
}: {
  slug: string;
  vehicles: VitrineVehicle[];
}) {
  const [query, setQuery] = useState("");
  const [brand, setBrand] = useState("todas");
  const [sort, setSort] = useState<SortOption>("relevancia");

  const brands = useMemo(
    () => Array.from(new Set(vehicles.map((v) => v.brand))).sort((a, b) => a.localeCompare(b, "pt-BR")),
    [vehicles],
  );

  const filtered = vehicles
    .filter((vehicle) => {
      const matchesQuery = `${vehicle.brand} ${vehicle.model}`
        .toLowerCase()
        .includes(query.trim().toLowerCase());
      const matchesBrand = brand === "todas" || vehicle.brand === brand;
      return matchesQuery && matchesBrand;
    })
    .sort((a, b) => {
      switch (sort) {
        case "menor_preco":
          return a.price - b.price;
        case "maior_preco":
          return b.price - a.price;
        case "az":
          return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`, "pt-BR");
        default:
          return 0;
      }
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
        <select
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#2596e0] sm:w-44"
        >
          <option value="todas">Todas as marcas</option>
          {brands.map((b) => (
            <option key={b} value={b}>
              {b}
            </option>
          ))}
        </select>
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value as SortOption)}
          className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-[#2596e0] sm:w-44"
        >
          {(Object.keys(sortLabel) as SortOption[]).map((option) => (
            <option key={option} value={option}>
              {sortLabel[option]}
            </option>
          ))}
        </select>
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
