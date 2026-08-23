import type { VendedorPerformance } from "@/lib/types/performance";
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
