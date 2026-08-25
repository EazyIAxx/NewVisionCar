export type RenaveStatus = "pendente" | "em_andamento" | "concluida" | "erro";

export const renaveStatusLabel: Record<RenaveStatus, string> = {
  pendente: "Pendente",
  em_andamento: "Em andamento",
  concluida: "Concluída",
  erro: "Erro",
};

export type RenaveTransfer = {
  id: string;
  saleId: string;
  status: RenaveStatus;
  buyerDocument: string;
  buyerRg: string;
  buyerAddress: string;
  protocol: string | null;
  updatedAt: string; // ISO
};
