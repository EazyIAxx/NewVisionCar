"use client";

import { useState } from "react";

import { Leaderboard } from "@/components/desempenho/leaderboard";
import { PerformanceChart } from "@/components/desempenho/performance-chart";
import { CommissionRatesPanel } from "@/components/desempenho/commission-rates-panel";
import type { CommissionRates, VendedorPerformance } from "@/lib/types/performance";
import type { Sale } from "@/lib/types/sale";
import { calculateVendedorCommission } from "@/app/(dashboard)/desempenho/mock-data";

export function DesempenhoDashboard({
  performance,
  sales,
  initialRates,
}: {
  performance: VendedorPerformance[];
  sales: Sale[];
  initialRates: CommissionRates;
}) {
  const [rates, setRates] = useState(initialRates);

  const ranking = performance
    .map((vendedor) => ({
      ...vendedor,
      commission: calculateVendedorCommission(sales, vendedor.id, rates),
    }))
    .sort((a, b) => b.totalSold - a.totalSold);

  return (
    <div className="flex flex-col gap-6">
      <PerformanceChart ranking={ranking} />
      <Leaderboard ranking={ranking} />
      <CommissionRatesPanel rates={rates} onChange={setRates} />
    </div>
  );
}
