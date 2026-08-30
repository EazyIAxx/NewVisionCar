import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { CommissionRates } from "@/lib/types/performance";

// Usado só quando a agência ainda não configurou nenhuma taxa própria (nunca
// salvou em Desempenho) — ponto de partida razoável, não um placeholder de
// mock: a partir da primeira gravação real, essa função nunca mais é usada
// pra essa agência.
const FALLBACK_RATES: CommissionRates = {
  a_vista: 0.01,
  financiado: 0.005,
  cartao: 0.005,
  consorcio: 0.004,
};

export async function fetchCommissionRates(): Promise<CommissionRates> {
  const supabase = await createClient();
  const { data } = await supabase.from("commission_rates").select("payment_method, rate");

  const rates = { ...FALLBACK_RATES };
  for (const row of data ?? []) {
    rates[row.payment_method as keyof CommissionRates] = Number(row.rate);
  }
  return rates;
}
