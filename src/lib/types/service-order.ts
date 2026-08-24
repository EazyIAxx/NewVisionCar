export type ServiceOrderType =
  | "revisao"
  | "higienizacao"
  | "funilaria"
  | "mecanica"
  | "pneus"
  | "outros";

export const serviceOrderTypeLabel: Record<ServiceOrderType, string> = {
  revisao: "Revisão",
  higienizacao: "Higienização",
  funilaria: "Funilaria",
  mecanica: "Mecânica",
  pneus: "Pneus",
  outros: "Outros",
};

export type ServiceOrderStatus = "pendente" | "em_andamento" | "concluida";

export const serviceOrderStatusLabel: Record<ServiceOrderStatus, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluída",
};

export type ServiceOrder = {
  id: string;
  vehicleId: string;
  type: ServiceOrderType;
  supplier: string;
  amount: number;
  status: ServiceOrderStatus;
  date: string; // ISO
};
