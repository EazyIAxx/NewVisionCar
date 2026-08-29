"use server";

import { createClient } from "@/lib/supabase/server";

export type ActionResult = { error: string | null };

type InterestInput = {
  slug: string;
  vehicleInterest: string;
  name: string;
  email?: string;
  phone: string;
  message?: string;
};

export async function sendInterest(input: InterestInput): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("create_vitrine_lead", {
    p_slug: input.slug,
    p_vehicle_interest: input.vehicleInterest,
    p_name: input.name,
    p_email: input.email ?? "",
    p_phone: input.phone,
    p_message: input.message ?? "",
  });

  if (error?.message === "agency_not_found") {
    return { error: "Não foi possível enviar sua proposta." };
  }

  return { error: error?.message ?? null };
}

type FinancingRequestInput = {
  slug: string;
  vehicleId: string;
  name: string;
  phone: string;
  email?: string;
  downPayment: number;
  termMonths: number;
  installmentEstimate: number;
};

export async function requestVitrineFinancing(input: FinancingRequestInput): Promise<ActionResult> {
  const supabase = await createClient();
  const { error } = await supabase.rpc("request_vitrine_financing", {
    p_slug: input.slug,
    p_vehicle_id: input.vehicleId,
    p_name: input.name,
    p_phone: input.phone,
    p_email: input.email ?? "",
    p_down_payment: input.downPayment,
    p_term_months: input.termMonths,
    p_installment_estimate: input.installmentEstimate,
  });

  if (error?.message === "vehicle_not_found") {
    return { error: "Não foi possível enviar sua solicitação." };
  }

  return { error: error?.message ?? null };
}
