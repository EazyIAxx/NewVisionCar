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
};

export const vehicleStatusLabel: Record<VehicleStatus, string> = {
  disponivel: "Disponível",
  reservado: "Reservado",
  vendido: "Vendido",
};
