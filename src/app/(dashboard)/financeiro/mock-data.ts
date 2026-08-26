import type { Expense, MonthlyFinance } from "@/lib/types/finance";
import type { Sale } from "@/lib/types/sale";

// TODO(M3 backend): remover e substituir por query real na tabela `expenses`.
export const mockExpenses: Expense[] = [
  {
    id: "1",
    category: "aluguel",
    description: "Aluguel do showroom — outubro",
    amount: 8500,
    date: "2026-10-05",
  },
  {
    id: "2",
    category: "funcionarios",
    description: "Folha de pagamento — outubro",
    amount: 22000,
    date: "2026-10-05",
  },
  {
    id: "3",
    category: "marketing",
    description: "Anúncios OLX + Instagram",
    amount: 3200,
    date: "2026-10-12",
  },
  {
    id: "4",
    category: "manutencao",
    description: "Revisão do Compass antes da venda",
    amount: 1450,
    date: "2026-10-18",
  },
  {
    id: "5",
    category: "marketing",
    description: "Impulsionamento Webmotors",
    amount: 1800,
    date: "2026-09-20",
  },
  {
    id: "6",
    category: "aluguel",
    description: "Aluguel do showroom — setembro",
    amount: 8500,
    date: "2026-09-05",
  },
];

const monthLabel = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function monthKey(iso: string) {
  return iso.slice(0, 7); // YYYY-MM
}

// TODO(M3 backend): calcular a partir de vendas + despesas reais por período
// (despesas ainda mockadas até o backend do Financeiro existir).
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
