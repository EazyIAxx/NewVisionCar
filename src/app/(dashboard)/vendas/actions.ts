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

type RenaveTransferInput = {
  saleId: string;
  buyerDocument: string;
  buyerRg: string;
  buyerAddress: string;
};

// TODO(M14 backend): substituir por chamada real à API do RENAVE (via
// DETRAN do estado ou provedor homologado) + insert na tabela `renave_transfers`.
export async function startRenaveTransfer(input: RenaveTransferInput): Promise<ActionResult> {
  console.log("start renave transfer (mock)", input);
  return { error: null };
}

// TODO(M14 backend): status real vem do retorno assíncrono da API do RENAVE
// (webhook/polling), não de uma ação disparada pelo usuário.
export async function completeRenaveTransfer(saleId: string): Promise<ActionResult> {
  console.log("complete renave transfer (mock)", saleId);
  return { error: null };
}
