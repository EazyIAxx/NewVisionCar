"use server";

import { randomUUID } from "node:crypto";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import type { VehicleStatus } from "@/lib/types/vehicle";
import type { ListingPortal } from "@/lib/types/listing";

export type ActionResult = { error: string | null };

// TODO(M11 backend): substituir por chamada real à API da OLX/Webmotors (ou
// parceiro agregador) + insert/update na tabela `listings`.
export async function publishListing(
  vehicleId: string,
  portal: ListingPortal,
): Promise<ActionResult> {
  console.log("publish listing (mock)", vehicleId, portal);
  return { error: null };
}

// TODO(M11 backend): substituir por remoção real do anúncio no portal +
// update de status na tabela `listings`.
export async function unpublishListing(
  vehicleId: string,
  portal: ListingPortal,
): Promise<ActionResult> {
  console.log("unpublish listing (mock)", vehicleId, portal);
  return { error: null };
}

export async function deleteVehicle(vehicleId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.from("vehicles").delete().eq("id", vehicleId);
  return { error: error?.message ?? null };
}

export async function updateVehicleStatus(
  vehicleId: string,
  status: VehicleStatus,
): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("vehicles")
    .update({ status })
    .eq("id", vehicleId);

  return { error: error?.message ?? null };
}

type ParsedVehicleForm = {
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  km: number;
  price: number;
  costPrice?: number;
  status: VehicleStatus;
  existingPhotos: string[];
  newFiles: File[];
};

function parseVehicleFormData(formData: FormData): ParsedVehicleForm {
  const costPriceRaw = formData.get("costPrice");
  return {
    brand: String(formData.get("brand")),
    model: String(formData.get("model")),
    year: Number(formData.get("year")),
    plate: String(formData.get("plate")),
    color: String(formData.get("color")),
    km: Number(formData.get("km")),
    price: Number(formData.get("price")),
    costPrice: costPriceRaw ? Number(costPriceRaw) : undefined,
    status: String(formData.get("status")) as VehicleStatus,
    existingPhotos: JSON.parse(String(formData.get("existingPhotos") ?? "[]")),
    newFiles: formData.getAll("newFiles").filter((f): f is File => f instanceof File),
  };
}

async function uploadPhotos(
  agencyId: string,
  vehicleId: string,
  files: File[],
): Promise<{ urls: string[]; error: string | null }> {
  if (files.length === 0) return { urls: [], error: null };

  const supabase = await createClient();
  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop() ?? "jpg";
    const path = `${agencyId}/${vehicleId}/${randomUUID()}.${ext}`;
    const { error } = await supabase.storage
      .from("vehicle-photos")
      .upload(path, file);

    if (error) return { urls, error: error.message };

    const { data } = supabase.storage.from("vehicle-photos").getPublicUrl(path);
    urls.push(data.publicUrl);
  }

  return { urls, error: null };
}

export async function createVehicle(formData: FormData): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Sessão inválida." };

  const form = parseVehicleFormData(formData);
  const supabase = await createClient();

  const { data: vehicle, error: insertError } = await supabase
    .from("vehicles")
    .insert({
      agency_id: profile.agency_id,
      brand: form.brand,
      model: form.model,
      year: form.year,
      plate: form.plate,
      color: form.color,
      km: form.km,
      price: form.price,
      // Custo só é gravado quando o próprio gestor preencheu o campo — o
      // form nem renderiza esse input para vendedor, mas reforçamos aqui.
      cost_price: profile.role === "gestor" ? form.costPrice ?? null : null,
      status: form.status,
    })
    .select("id")
    .single();

  if (insertError || !vehicle) {
    return { error: insertError?.message ?? "Não foi possível criar o veículo." };
  }

  const { urls, error: uploadError } = await uploadPhotos(
    profile.agency_id,
    vehicle.id,
    form.newFiles,
  );
  if (uploadError) return { error: uploadError };

  if (urls.length > 0) {
    const { error: photosError } = await supabase
      .from("vehicles")
      .update({ photos: urls })
      .eq("id", vehicle.id);
    if (photosError) return { error: photosError.message };
  }

  return { error: null };
}

export async function updateVehicle(
  vehicleId: string,
  formData: FormData,
): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Sessão inválida." };

  const form = parseVehicleFormData(formData);

  const { urls: newUrls, error: uploadError } = await uploadPhotos(
    profile.agency_id,
    vehicleId,
    form.newFiles,
  );
  if (uploadError) return { error: uploadError };

  const supabase = await createClient();
  const { error } = await supabase
    .from("vehicles")
    .update({
      brand: form.brand,
      model: form.model,
      year: form.year,
      plate: form.plate,
      color: form.color,
      km: form.km,
      price: form.price,
      cost_price: profile.role === "gestor" ? form.costPrice ?? null : undefined,
      status: form.status,
      photos: [...form.existingPhotos, ...newUrls],
    })
    .eq("id", vehicleId);

  return { error: error?.message ?? null };
}
