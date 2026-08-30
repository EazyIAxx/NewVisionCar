import { TrendingDown, TrendingUp, Wallet } from "lucide-react";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import { FinanceOverviewChart } from "@/components/financeiro/finance-overview-chart";
import { fetchSales } from "@/lib/data/sales";
import { fetchExpenses } from "@/lib/data/expenses";
import { computeMonthlyFinance } from "@/app/(dashboard)/financeiro/mock-data";

export default async function FinanceiroPage() {
  const [sales, expenses] = await Promise.all([fetchSales(), fetchExpenses()]);

  const totalRevenue = sales.reduce((sum, sale) => sum + sale.amount, 0);
  const totalCost = sales.reduce((sum, sale) => sum + (sale.costPrice ?? 0), 0);
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);
  const netProfit = totalRevenue - totalCost - totalExpenses;
  const monthlyFinance = computeMonthlyFinance(sales, expenses);

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
          <CardDescription>Últimos meses</CardDescription>
        </CardHeader>
        <CardContent>
          <FinanceOverviewChart data={monthlyFinance} />
        </CardContent>
      </Card>
    </div>
  );
}
