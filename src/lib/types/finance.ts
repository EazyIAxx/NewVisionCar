export type ExpenseCategory =
  | "aluguel"
  | "funcionarios"
  | "manutencao"
  | "marketing";

export const expenseCategoryLabel: Record<ExpenseCategory, string> = {
  aluguel: "Aluguel",
  funcionarios: "Funcionários",
  manutencao: "Manutenção",
  marketing: "Marketing",
};

export type Expense = {
  id: string;
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string; // ISO
};

export type MonthlyFinance = {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
};
