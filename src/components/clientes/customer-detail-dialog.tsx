"use client";

import { useState } from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Trash2 } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { formatCurrency } from "@/lib/utils";
import type { Customer } from "@/lib/types/customer";
import { CustomerStatusBadge } from "@/components/clientes/status-badge";
import { deleteCustomer } from "@/app/(dashboard)/clientes/actions";

export function CustomerDetailDialog({
  customer,
  open,
  onOpenChange,
  onDelete,
}: {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDelete: (customerId: string) => void;
}) {
  const [isDeleting, setIsDeleting] = useState(false);

  async function handleDelete() {
    setIsDeleting(true);
    const result = await deleteCustomer(customer.id);
    if (result?.error) {
      toast.error(result.error);
      setIsDeleting(false);
      return;
    }
    toast.success("Cliente excluído");
    setIsDeleting(false);
    onDelete(customer.id);
    onOpenChange(false);
  }
  const purchases = [...customer.purchases].sort((a, b) =>
    a.date < b.date ? 1 : -1,
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{customer.name}</DialogTitle>
          <DialogDescription>
            {customer.phone ?? "Sem telefone"}
            {customer.email ? ` · ${customer.email}` : ""}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-wrap items-center gap-2">
          <CustomerStatusBadge status={customer.status} />
          <span className="text-sm text-muted-foreground">
            Vendedor: {customer.vendedorName}
          </span>
        </div>

        {customer.vehicleInterest && (
          <p className="text-sm text-muted-foreground">
            Interesse atual: {customer.vehicleInterest}
          </p>
        )}

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium">Histórico de compras</p>
          {purchases.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Nenhuma compra registrada ainda.
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {purchases.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between rounded-lg border px-3 py-2 text-sm"
                >
                  <div>
                    <p className="font-medium">
                      {sale.vehicleBrand} {sale.vehicleModel}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {format(new Date(sale.date), "d 'de' MMM 'de' yyyy", {
                        locale: ptBR,
                      })}
                    </p>
                  </div>
                  <p className="font-medium">{formatCurrency(sale.amount)}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <DialogFooter>
          <AlertDialog>
            <AlertDialogTrigger
              render={<Button variant="destructive" className="cursor-pointer" />}
            >
              <Trash2 />
              Excluir cliente
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Excluir {customer.name}?</AlertDialogTitle>
                <AlertDialogDescription>
                  Essa ação remove o cliente da listagem. O histórico de
                  compras já registrado não é apagado.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction
                  className="cursor-pointer bg-destructive text-white hover:bg-destructive/90"
                  disabled={isDeleting}
                  onClick={handleDelete}
                >
                  {isDeleting ? "Excluindo..." : "Excluir"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
