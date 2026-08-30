"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { formatCurrency } from "@/lib/utils";
import { expenseCategoryLabel, type Expense } from "@/lib/types/finance";
import { deleteExpense } from "@/app/(dashboard)/financeiro/actions";

export function ExpensesTable({ expenses }: { expenses: Expense[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleDelete(expenseId: string) {
    setDeletingId(expenseId);
    const result = await deleteExpense(expenseId);
    if (result?.error) {
      toast.error(result.error);
      setDeletingId(null);
      return;
    }
    toast.success("Despesa excluída");
    router.refresh();
    setDeletingId(null);
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Data</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead className="w-10" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {expenses.length === 0 && (
          <TableRow>
            <TableCell colSpan={5} className="text-center text-sm text-muted-foreground">
              Nenhuma despesa lançada ainda.
            </TableCell>
          </TableRow>
        )}
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
            <TableCell>
              <AlertDialog>
                <AlertDialogTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon"
                      className="cursor-pointer text-muted-foreground hover:text-destructive"
                      disabled={deletingId === expense.id}
                      aria-label="Excluir despesa"
                    />
                  }
                >
                  <Trash2 className="size-4" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Excluir despesa?</AlertDialogTitle>
                    <AlertDialogDescription>
                      &ldquo;{expense.description}&rdquo; ({formatCurrency(expense.amount)}) será
                      removida permanentemente. Essa ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                      className="cursor-pointer bg-destructive text-white hover:bg-destructive/90"
                      onClick={() => handleDelete(expense.id)}
                    >
                      Excluir
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
