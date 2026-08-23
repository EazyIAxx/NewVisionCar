import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { expenseCategoryLabel } from "@/lib/types/finance";
import { ExpenseFormDialog } from "@/components/financeiro/expense-form-dialog";
import { mockExpenses } from "@/app/(dashboard)/financeiro/mock-data";

export default function DespesasPage() {
  const expenses = [...mockExpenses].sort((a, b) => (a.date < b.date ? 1 : -1));
  const total = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          Total lançado: <span className="font-medium text-foreground">{formatCurrency(total)}</span>
        </p>
        <ExpenseFormDialog />
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Categoria</TableHead>
            <TableHead>Descrição</TableHead>
            <TableHead className="text-right">Valor</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {expenses.map((expense) => (
            <TableRow key={expense.id}>
              <TableCell className="text-muted-foreground">
                {new Date(expense.date).toLocaleDateString("pt-BR")}
              </TableCell>
              <TableCell>
                <Badge variant="secondary">
                  {expenseCategoryLabel[expense.category]}
                </Badge>
              </TableCell>
              <TableCell>{expense.description}</TableCell>
              <TableCell className="text-right font-medium">
                {formatCurrency(expense.amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
