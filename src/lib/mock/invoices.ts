import type { FiscalSettings, Invoice } from "@/lib/types/invoice";

// TODO(M10 backend): substituir por leitura real de `agencies` (dados fiscais).
export const mockFiscalSettings: FiscalSettings = {
  cnpj: "12.345.678/0001-90",
  inscricaoEstadual: "123.456.789.112",
  inscricaoMunicipal: "",
  regime: "simples_nacional",
};

// TODO(M10 backend): substituir por tabela `invoices` real, vinculada a `sales`.
export const mockInvoices: Invoice[] = [
  {
    id: "inv-1",
    saleId: "1",
    status: "emitida",
    numero: "1024",
    chaveAcesso: "3526...9401",
    emittedAt: "2026-09-23T10:00:00Z",
  },
  {
    id: "inv-3",
    saleId: "3",
    status: "emitida",
    numero: "1031",
    chaveAcesso: "3526...9482",
    emittedAt: "2026-10-06T14:30:00Z",
  },
  {
    id: "inv-6",
    saleId: "6",
    status: "cancelada",
    numero: "1029",
    chaveAcesso: "3526...9455",
    emittedAt: "2026-10-09T09:00:00Z",
  },
];

export function getInvoiceForSale(saleId: string): Invoice | null {
  return mockInvoices.find((invoice) => invoice.saleId === saleId) ?? null;
}
