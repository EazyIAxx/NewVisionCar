import type { LeadStage } from "./lead";
import type { Sale } from "./sale";

export type CustomerStatus = "cliente" | "perdido" | "em_andamento";

export const customerStatusLabel: Record<CustomerStatus, string> = {
  cliente: "Cliente",
  perdido: "Perdido",
  em_andamento: "Lead ativo",
};

export type Customer = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  vendedorName: string;
  status: CustomerStatus;
  leadStage: LeadStage | null;
  vehicleInterest: string | null;
  purchases: Sale[];
};
