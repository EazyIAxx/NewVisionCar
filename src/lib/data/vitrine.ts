import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { FuelType, Transmission, VitrineSettings, VitrineVehicle } from "@/lib/types/vitrine";

export async function fetchVitrineAgency(slug: string): Promise<VitrineSettings | null> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_vitrine_agency", { p_slug: slug });
  const row = data?.[0];
  if (!row) return null;

  return {
    slug: row.slug ?? slug,
    displayName: row.name ?? "",
    accentColor: row.accent_color ?? "#2596e0",
    whatsapp: row.whatsapp ?? "",
  };
}

export async function fetchVitrineVehicles(slug: string): Promise<VitrineVehicle[]> {
  const supabase = await createClient();
  const { data } = await supabase.rpc("get_vitrine_vehicles", { p_slug: slug });

  return (data ?? []).map((row) => ({
    id: row.id,
    brand: row.brand,
    model: row.model,
    year: row.year,
    km: row.km,
    price: Number(row.price),
    color: row.color,
    transmission: row.transmission as Transmission | null,
    fuelType: row.fuel_type as FuelType | null,
    features: row.features ?? [],
    description: row.description,
    photos: row.photos ?? [],
  }));
}
