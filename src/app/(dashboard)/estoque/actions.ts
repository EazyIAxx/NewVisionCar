"use server";

import type { VehicleStatus } from "@/lib/types/vehicle";

export type UpdateStatusResult = { error: string | null };

// TODO(M2 backend): substituir por update real na tabela `vehicles` (RLS por agency_id).
export async function updateVehicleStatus(
  vehicleId: string,
  status: VehicleStatus,
): Promise<UpdateStatusResult> {
  console.log("update vehicle status (mock)", vehicleId, status);
  return { error: null };
}

type VehicleInput = {
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  km: number;
  price: number;
  costPrice?: number;
  status: VehicleStatus;
};

// TODO(M2 backend): substituir por insert real na tabela `vehicles` + upload das fotos no Storage.
export async function createVehicle(payload: {
  values: VehicleInput;
  existingPhotos: string[];
  newFiles: File[];
}): Promise<UpdateStatusResult> {
  console.log("create vehicle (mock)", payload.values);
  return { error: null };
}

// TODO(M2 backend): substituir por update real na tabela `vehicles`.
export async function updateVehicle(
  vehicleId: string,
  payload: {
    values: VehicleInput;
    existingPhotos: string[];
    newFiles: File[];
  },
): Promise<UpdateStatusResult> {
  console.log("update vehicle (mock)", vehicleId, payload.values);
  return { error: null };
}
