"use client";

import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { formatCurrency } from "@/lib/utils";
import type { Customer } from "@/lib/types/customer";
import { CustomerStatusBadge } from "@/components/clientes/status-badge";

export function CustomerDetailDialog({
  customer,
  open,
  onOpenChange,
}: {
  customer: Customer;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
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
      </DialogContent>
    </Dialog>
  );
}
