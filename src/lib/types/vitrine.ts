export type VitrineSettings = {
  slug: string;
  displayName: string;
  accentColor: string;
  whatsapp: string;
};

export type Transmission = "manual" | "automatico";

export const transmissionLabel: Record<Transmission, string> = {
  manual: "Manual",
  automatico: "Automático",
};

export type FuelType = "flex" | "gasolina" | "diesel" | "hibrido" | "eletrico";

export const fuelTypeLabel: Record<FuelType, string> = {
  flex: "Flex",
  gasolina: "Gasolina",
  diesel: "Diesel",
  hibrido: "Híbrido",
  eletrico: "Elétrico",
};

export type VitrineVehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  price: number;
  color: string;
  transmission: Transmission | null;
  fuelType: FuelType | null;
  features: string[];
  description: string | null;
  photos: string[];
};

export type InterestFormInput = {
  vehicleId: string;
  name: string;
  email?: string;
  phone: string;
  message?: string;
};
