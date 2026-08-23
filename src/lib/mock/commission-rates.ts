import type { CommissionRates } from "@/lib/types/performance";

// TODO(M5 backend): substituir por tabela `commission_rules`
// (`agency_id`, `payment_method`, `rate`).
export const defaultCommissionRates: CommissionRates = {
  a_vista: 0.01,
  financiado: 0.005,
  cartao: 0.005,
  consorcio: 0.004,
};
