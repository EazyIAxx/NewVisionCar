"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import type { PaymentMethod } from "@/lib/types/sale";

export type ActionResult = { error: string | null };

type SaleInput = {
  customerName: string;
  vehicleBrand: string;
  vehicleModel: string;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string;
  vendedorId: string;
};

export async function createSale(input: SaleInput): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Sessão inválida." };

  const supabase = await createClient();
  const { error } = await supabase.from("sales").insert({
    agency_id: profile.agency_id,
    vendedor_id: input.vendedorId,
    customer_name: input.customerName,
    vehicle_brand: input.vehicleBrand,
    vehicle_model: input.vehicleModel,
    amount: input.amount,
    payment_method: input.paymentMethod,
    sale_date: input.date,
    // TODO: permitir vincular a um veículo do estoque pra herdar o
    // cost_price automaticamente, em vez de 0.
    cost_price: 0,
  });

  return { error: error?.message ?? null };
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
