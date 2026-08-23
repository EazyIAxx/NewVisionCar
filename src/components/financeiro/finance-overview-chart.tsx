"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  type ChartConfig,
} from "@/components/ui/chart";
import type { MonthlyFinance } from "@/lib/types/finance";

const chartConfig = {
  revenue: {
    label: "Faturamento",
    color: "var(--primary)",
  },
  expenses: {
    label: "Despesas",
    color: "var(--status-lost)",
  },
  profit: {
    label: "Lucro líquido",
    color: "var(--status-available)",
  },
} satisfies ChartConfig;

export function FinanceOverviewChart({ data }: { data: MonthlyFinance[] }) {
  return (
    <ChartContainer config={chartConfig} className="aspect-auto h-[320px] w-full">
      <BarChart data={data}>
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="month"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
        />
        <ChartTooltip content={<ChartTooltipContent indicator="dot" />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="revenue" fill="var(--color-revenue)" radius={4} />
        <Bar dataKey="expenses" fill="var(--color-expenses)" radius={4} />
        <Bar dataKey="profit" fill="var(--color-profit)" radius={4} />
      </BarChart>
    </ChartContainer>
  );
}
