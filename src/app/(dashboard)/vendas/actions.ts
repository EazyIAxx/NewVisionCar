"use server";

import type { PaymentMethod } from "@/lib/types/sale";

export type ActionResult = { error: string | null };

type SaleInput = {
  customerName: string;
  vehicleBrand: string;
  vehicleModel: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
  vendedorName: string;
};

// TODO(backend): substituir por insert real na tabela `sales` (RLS: Gestor
// vê todas as vendas da agência, Vendedor só as próprias).
export async function createSale(input: SaleInput): Promise<ActionResult> {
  console.log("create sale (mock)", input);
  return { error: null };
}

// TODO(M10 backend): substituir por chamada real ao provedor de NF-e (ex:
// Focus NFe, NFE.io) + insert na tabela `invoices`.
export async function emitInvoice(saleId: string): Promise<ActionResult> {
  console.log("emit invoice (mock)", saleId);
  return { error: null };
}
