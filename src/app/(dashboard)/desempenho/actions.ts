"use server";

import type { CommissionRates } from "@/lib/types/performance";

export type ActionResult = { error: string | null };

// TODO(M5 backend): substituir por update real na tabela `commission_rules`.
export async function saveCommissionRates(rates: CommissionRates): Promise<ActionResult> {
  console.log("save commission rates (mock)", rates);
  return { error: null };
}
