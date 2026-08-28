import type { FuelType, Transmission } from "@/lib/types/vitrine";

export type VehicleStatus = "disponivel" | "reservado" | "vendido";

export type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  plate: string;
  color: string;
  km: number;
  price: number;
  costPrice: number | null;
  status: VehicleStatus;
  photos: string[];
  // Exibidos na ficha pública da vitrine (M12) — opcionais, veículo cadastrado
  // antes deles ainda aparece na vitrine sem essas informações.
  transmission: Transmission | null;
  fuelType: FuelType | null;
  description: string | null;
  features: string[];
};

export const vehicleStatusLabel: Record<VehicleStatus, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
};
