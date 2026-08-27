import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { FiscalSettings, Invoice, InvoiceStatus, TaxRegime } from "@/lib/types/invoice";

// RLS restringe `invoices` a Gestor — Vendedor recebe um objeto vazio aqui,
// não um erro (mesmo efeito de "não vê nada", nem por RLS nem pela UI).
export async function fetchInvoicesBySaleId(): Promise<Record<string, Invoice>> {
  const supabase = await createClient();
  const { data } = await supabase.from("invoices").select("*");

  const map: Record<string, Invoice> = {};
  for (const row of data ?? []) {
    map[row.sale_id] = {
      id: row.id,
      saleId: row.sale_id,
      status: row.status as InvoiceStatus,
      numero: row.numero,
      chaveAcesso: row.chave_acesso,
      emittedAt: row.emitted_at,
    };
  }
  return map;
}

const defaultFiscalSettings: FiscalSettings = {
  cnpj: "",
  inscricaoEstadual: "",
  inscricaoMunicipal: "",
  regime: "simples_nacional",
};

export async function fetchFiscalSettings(agencyId: string): Promise<FiscalSettings> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("agencies")
    .select("cnpj, inscricao_estadual, inscricao_municipal, regime_tributario")
    .eq("id", agencyId)
    .single();

  if (!data) return defaultFiscalSettings;

  return {
    cnpj: data.cnpj ?? "",
    inscricaoEstadual: data.inscricao_estadual ?? "",
    inscricaoMunicipal: data.inscricao_municipal ?? "",
    regime: (data.regime_tributario as TaxRegime | null) ?? "simples_nacional",
  };
}
