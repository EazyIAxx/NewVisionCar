"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import type { CommissionRates } from "@/lib/types/performance";
import type { PaymentMethod } from "@/lib/types/sale";

export type ActionResult = { error: string | null };

export async function saveCommissionRates(rates: CommissionRates): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (profile?.role !== "gestor" || !profile.agency_id) {
    return { error: "Apenas o gestor pode alterar as regras de comissão." };
  }
  const agencyId = profile.agency_id;

  const supabase = await createClient();
  const { error } = await supabase.from("commission_rates").upsert(
    (Object.keys(rates) as PaymentMethod[]).map((paymentMethod) => ({
      agency_id: agencyId,
      payment_method: paymentMethod,
      rate: rates[paymentMethod],
      updated_at: new Date().toISOString(),
    })),
    { onConflict: "agency_id,payment_method" },
  );

  return { error: error?.message ?? null };
}
