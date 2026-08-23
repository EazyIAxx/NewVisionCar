export type InvoiceStatus = "pendente" | "emitida" | "cancelada";

export const invoiceStatusLabel: Record<InvoiceStatus, string> = {
  pendente: "Pendente",
  emitida: "Emitida",
  cancelada: "Cancelada",
};

export type TaxRegime =
  | "simples_nacional"
  | "lucro_presumido"
  | "lucro_real"
  | "mei";

export const taxRegimeLabel: Record<TaxRegime, string> = {
  simples_nacional: "Simples Nacional",
  lucro_presumido: "Lucro Presumido",
  lucro_real: "Lucro Real",
  mei: "MEI",
};

export type FiscalSettings = {
  cnpj: string;
  inscricaoEstadual: string;
  inscricaoMunicipal: string;
  regime: TaxRegime;
};

export type Invoice = {
  id: string;
  saleId: string;
  status: InvoiceStatus;
  numero: string | null;
  chaveAcesso: string | null;
  emittedAt: string | null; // ISO
};
