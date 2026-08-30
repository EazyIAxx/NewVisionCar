import type { CommissionRates, VendedorPerformance } from "@/lib/types/performance";
import type { Sale } from "@/lib/types/sale";

// Agregado a partir da fonte única de vendas (`@/lib/data/sales`), compartilhada
// com Vendas e Financeiro, para não haver números divergentes entre módulos.
export function computePerformance(sales: Sale[]): VendedorPerformance[] {
  const totals = new Map<
    string,
    { name: string; vehiclesSold: number; totalSold: number }
  >();
  for (const sale of sales) {
    const current = totals.get(sale.vendedorId) ?? {
      name: sale.vendedorName,
      vehiclesSold: 0,
      totalSold: 0,
    };
    current.vehiclesSold += 1;
    current.totalSold += sale.amount;
    totals.set(sale.vendedorId, current);
  }

  return Array.from(totals.entries()).map(([id, stats]) => ({
    id,
    name: stats.name,
    vehiclesSold: stats.vehiclesSold,
    totalSold: stats.totalSold,
  }));
}

// Comissão varia por forma de pagamento (definida pelo Gestor em Desempenho),
// não é mais um percentual único sobre o total vendido.
export function calculateVendedorCommission(
  sales: Sale[],
  vendedorId: string,
  rates: CommissionRates,
): number {
  return sales
    .filter((sale) => sale.vendedorId === vendedorId)
    .reduce((sum, sale) => sum + sale.amount * rates[sale.paymentMethod], 0);
}
