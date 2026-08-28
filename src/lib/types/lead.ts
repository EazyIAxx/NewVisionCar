export type LeadStage =
  | "novo"
  | "contato_feito"
  | "visita_agendada"
  | "negociacao"
  | "venda_fechada"
  | "perdido";

export const leadStageLabel: Record<LeadStage, string> = {
  novo: "Novo",
  contato_feito: "Contato feito",
  visita_agendada: "Visita agendada",
  negociacao: "Negociação",
  venda_fechada: "Venda fechada",
  perdido: "Perdido",
};

export const leadStageOrder: LeadStage[] = [
  "novo",
  "contato_feito",
  "visita_agendada",
  "negociacao",
  "venda_fechada",
  "perdido",
];

export type LeadOrigin = "whatsapp" | "site" | "indicacao";

export const leadOriginLabel: Record<LeadOrigin, string> = {
  whatsapp: "WhatsApp",
  site: "Site",
  indicacao: "Indicação",
};

export type LeadActivityType = "nota" | "ligacao" | "mensagem" | "visita";

export const leadActivityTypeLabel: Record<LeadActivityType, string> = {
  nota: "Nota",
  ligacao: "Ligação",
  mensagem: "Mensagem",
  visita: "Visita",
};

export type LeadActivity = {
  id: string;
  type: LeadActivityType;
  description: string;
  date: string; // ISO
};

export type Lead = {
  id: string;
  name: string;
  phone: string;
  email: string | null;
  origin: LeadOrigin;
  vehicleInterest: string | null;
  stage: LeadStage;
  // null quando o lead veio da vitrine pública (ninguém logado pra atribuir)
  // — fica visível a todos os vendedores até alguém "pegar" o lead.
  vendedorId: string | null;
  vendedorName: string | null;
  visitDate: string | null; // ISO — só preenchido quando stage === "visita_agendada"
  createdAt: string; // ISO
  activities: LeadActivity[];
};
