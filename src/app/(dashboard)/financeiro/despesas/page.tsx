import { formatCurrency } from "@/lib/utils";
import { ExpenseFormDialog } from "@/components/financeiro/expense-form-dialog";
import { ExpensesTable } from "@/components/financeiro/expenses-table";
import { fetchExpenses } from "@/lib/data/expenses";

export default async function DespesasPage() {
  const expenses = await fetchExpenses();
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Total lançado: <span className="font-medium text-foreground">{formatCurrency(total)}</span>
        </p>
        <ExpenseFormDialog />
      </div>

      <ExpensesTable expenses={expenses} />
    </div>
  );
}
