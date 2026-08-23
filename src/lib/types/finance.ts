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

export type Sale = {
  id: string;
  vehicleBrand: string;
  vehicleModel: string;
  vendedorName: string;
  saleDate: string; // ISO
  salePrice: number;
  costPrice: number;
};

export type MonthlyFinance = {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
};
