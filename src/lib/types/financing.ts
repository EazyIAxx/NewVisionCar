export type FinancingRequestStatus = "pendente" | "aprovado" | "recusado";

export const financingRequestStatusLabel: Record<FinancingRequestStatus, string> = {
  pendente: "Pendente",
  aprovado: "Aprovado",
  recusado: "Recusado",
};

export type FinancingRequest = {
  id: string;
  vehicleId: string;
  leadId: string | null;
  status: FinancingRequestStatus;
  customerName: string;
  customerPhone: string;
  customerEmail: string | null;
  downPayment: number;
  termMonths: number;
  installmentEstimate: number;
  createdAt: string; // ISO
};
