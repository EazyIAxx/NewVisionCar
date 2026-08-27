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
  vehicleId?: string;
};

export async function createSale(input: SaleInput): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Sessão inválida." };

  const supabase = await createClient();

  // Venda avulsa (sem veículo do estoque vinculado) não tem como apurar
  // custo real, então fica 0 — a que vincula um veículo herda
  // automaticamente cost_price do veículo + soma das ordens de serviço, via
  // RPC (Vendedor não tem select em `vehicles.cost_price`/`service_orders`,
  // mas precisa registrar vendas com o custo correto).
  let costPrice = 0;
  if (input.vehicleId) {
    const { data } = await supabase.rpc("compute_vehicle_cost", {
      p_vehicle_id: input.vehicleId,
    });
    costPrice = Number(data ?? 0);
  }

  const { error } = await supabase.from("sales").insert({
    agency_id: profile.agency_id,
    vendedor_id: input.vendedorId,
    vehicle_id: input.vehicleId ?? null,
    customer_name: input.customerName,
    vehicle_brand: input.vehicleBrand,
    vehicle_model: input.vehicleModel,
    amount: input.amount,
    payment_method: input.paymentMethod,
    sale_date: input.date,
    cost_price: costPrice,
  });

  return { error: error?.message ?? null };
}

// TODO: substituir por chamada real ao provedor de NF-e (ex: Focus NFe,
// NFE.io) assim que a conta/chave de API existir — por enquanto só cria o
// registro como "pendente" (nada foi de fato enviado a um provedor fiscal).
export async function emitInvoice(saleId: string): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Sessão inválida." };

  const supabase = await createClient();
  const { error } = await supabase.from("invoices").insert({
    agency_id: profile.agency_id,
    sale_id: saleId,
    status: "pendente",
  });

  return { error: error?.message ?? null };
}

// TODO: remover quando o provedor real existir — o status "emitida" real
// vem do retorno da API do provedor de NF-e, não de uma ação manual.
export async function markInvoiceEmitted(saleId: string): Promise<ActionResult> {
  const supabase = await createClient();
  const numero = String(Math.floor(1000 + Math.random() * 9000));
  const chaveAcesso = Array.from({ length: 4 }, () =>
    Math.floor(1000 + Math.random() * 9000),
  ).join(".");

  const { error } = await supabase
    .from("invoices")
    .update({
      status: "emitida",
      numero,
      chave_acesso: chaveAcesso,
      emitted_at: new Date().toISOString(),
    })
    .eq("sale_id", saleId);

  return { error: error?.message ?? null };
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
