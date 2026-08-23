"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { VendedorPerformanceWithCommission } from "@/lib/types/performance";

const chartConfig = {
  totalSold: {
    label: "Total vendido",
    color: "var(--primary)",
  },
  commission: {
    label: "Comissão",
    color: "var(--status-available)",
  },
} satisfies ChartConfig;

export function PerformanceChart({
  ranking,
}: {
  ranking: VendedorPerformanceWithCommission[];
}) {
  const data = ranking.map((vendedor) => ({
    name: vendedor.name,
    totalSold: vendedor.totalSold,
    commission: vendedor.commission,
  }));

  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[280px] w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tickMargin={8} />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <Bar dataKey="totalSold" fill="var(--color-totalSold)" radius={4} />
        <Bar dataKey="commission" fill="var(--color-commission)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
