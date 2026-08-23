import type { CommissionRates, VendedorPerformance } from "@/lib/types/performance";
import { mockSales } from "@/lib/mock/sales";

// Agregado a partir da fonte única de vendas (`@/lib/mock/sales`), compartilhada
// com Vendas e Financeiro, para não haver números divergentes entre módulos.
// TODO(M5 backend): trocar por agregação real de vendas (M2) + atribuição de fechamento (M4).
const totals = new Map<string, { vehiclesSold: number; totalSold: number }>();
for (const sale of mockSales) {
  const current = totals.get(sale.vendedorName) ?? { vehiclesSold: 0, totalSold: 0 };
  current.vehiclesSold += 1;
  current.totalSold += sale.amount;
  totals.set(sale.vendedorName, current);
}

export const mockPerformance: VendedorPerformance[] = Array.from(
  totals.entries(),
).map(([name, stats], index) => ({
  id: String(index + 1),
  name,
  ...stats,
}));

// Comissão varia por forma de pagamento (definida pelo Gestor em Desempenho),
// não é mais um percentual único sobre o total vendido.
export function calculateVendedorCommission(
  vendedorName: string,
  rates: CommissionRates,
): number {
  return mockSales
    .filter((sale) => sale.vendedorName === vendedorName)
    .reduce((sum, sale) => sum + sale.amount * rates[sale.paymentMethod], 0);
}
