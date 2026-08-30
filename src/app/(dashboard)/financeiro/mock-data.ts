import type { Expense, MonthlyFinance } from "@/lib/types/finance";
import type { Sale } from "@/lib/types/sale";

const monthLabel = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function monthKey(iso: string) {
  return iso.slice(0, 7); // YYYY-MM
}

export function computeMonthlyFinance(sales: Sale[], expenses: Expense[]): MonthlyFinance[] {
  const months = Array.from(
    new Set([
      ...sales.map((sale) => monthKey(sale.date)),
      ...expenses.map((expense) => monthKey(expense.date)),
    ]),
  ).sort();

  return months.map((key) => {
    const monthIndex = Number(key.split("-")[1]) - 1;
    const salesInMonth = sales.filter((sale) => monthKey(sale.date) === key);
    const expensesInMonth = expenses.filter(
      (expense) => monthKey(expense.date) === key,
    );
    const revenue = salesInMonth.reduce((sum, sale) => sum + sale.amount, 0);
    const cost = salesInMonth.reduce((sum, sale) => sum + (sale.costPrice ?? 0), 0);
    const expensesTotal = expensesInMonth.reduce((sum, expense) => sum + expense.amount, 0);
    return {
      month: monthLabel[monthIndex],
      revenue,
      expenses: expensesTotal,
      profit: revenue - cost - expensesTotal,
    };
  });
}
