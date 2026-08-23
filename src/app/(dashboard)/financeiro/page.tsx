import { TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { FinanceOverviewChart } from "@/components/financeiro/finance-overview-chart";
import { mockExpenses, mockMonthlyFinance, mockSales } from "@/app/(dashboard)/financeiro/mock-data";

export default function FinanceiroPage() {
  const totalRevenue = mockSales.reduce((sum, sale) => sum + sale.salePrice, 0);
  const totalCost = mockSales.reduce((sum, sale) => sum + sale.costPrice, 0);
  const totalExpenses = mockExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalRevenue - totalCost - totalExpenses;

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <Wallet className="size-4" /> Faturamento
            </CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalRevenue)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <TrendingDown className="size-4" /> Despesas
            </CardDescription>
            <CardTitle className="text-2xl">{formatCurrency(totalExpenses)}</CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription className="flex items-center gap-1.5">
              <TrendingUp className="size-4" /> Lucro líquido
            </CardDescription>
            <CardTitle className="text-2xl text-status-available">
              {formatCurrency(netProfit)}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Faturamento, despesas e lucro por mês</CardTitle>
          <CardDescription>Últimos 6 meses</CardDescription>
        </CardHeader>
        <CardContent>
          <FinanceOverviewChart data={mockMonthlyFinance} />
        </CardContent>
      </Card>
    </div>
  );
}
