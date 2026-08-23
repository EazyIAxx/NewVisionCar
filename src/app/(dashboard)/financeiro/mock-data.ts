import type { Expense, MonthlyFinance } from "@/lib/types/finance";
import { mockSales } from "@/lib/mock/sales";

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

// Reexportado para uso no módulo Financeiro — fonte única de vendas
// compartilhada com Vendas e Desempenho (ver `@/lib/mock/sales`).
export { mockSales };

const monthLabel = [
  "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
  "Jul", "Ago", "Set", "Out", "Nov", "Dez",
];

function monthKey(iso: string) {
  return iso.slice(0, 7); // YYYY-MM
}

const months = Array.from(
  new Set([
    ...mockSales.map((sale) => monthKey(sale.date)),
    ...mockExpenses.map((expense) => monthKey(expense.date)),
  ]),
).sort();

// TODO(M3 backend): calcular a partir de vendas + despesas reais por período.
export const mockMonthlyFinance: MonthlyFinance[] = months.map((key) => {
  const monthIndex = Number(key.split("-")[1]) - 1;
  const salesInMonth = mockSales.filter((sale) => monthKey(sale.date) === key);
  const expensesInMonth = mockExpenses.filter(
    (expense) => monthKey(expense.date) === key,
  );
  const revenue = salesInMonth.reduce((sum, sale) => sum + sale.amount, 0);
  const cost = salesInMonth.reduce((sum, sale) => sum + sale.costPrice, 0);
  const expenses = expensesInMonth.reduce((sum, expense) => sum + expense.amount, 0);
  return {
    month: monthLabel[monthIndex],
    revenue,
    expenses,
    profit: revenue - cost - expenses,
  };
});
