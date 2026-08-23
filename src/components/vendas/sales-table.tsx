"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import type { Sale } from "@/lib/types/sale";
import { paymentMethodLabel } from "@/lib/types/sale";
import type { InvoiceStatus } from "@/lib/types/invoice";
import { getInvoiceForSale } from "@/lib/mock/invoices";
import { InvoiceStatusBadge } from "@/components/vendas/invoice-status-badge";
import { emitInvoice } from "@/app/(dashboard)/vendas/actions";

export function SalesTable({ sales }: { sales: Sale[] }) {
  const [query, setQuery] = useState("");
  const [invoiceStatuses, setInvoiceStatuses] = useState<Record<string, InvoiceStatus>>(
    () =>
      Object.fromEntries(
        sales.map((sale) => [sale.id, getInvoiceForSale(sale.id)?.status ?? "pendente"]),
      ),
  );
  const [emitting, setEmitting] = useState<string | null>(null);

  const filtered = sales.filter((sale) =>
    sale.customerName.toLowerCase().includes(query.trim().toLowerCase()),
  );

  async function handleEmit(saleId: string) {
    setEmitting(saleId);
    const result = await emitInvoice(saleId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Nota fiscal emitida");
      setInvoiceStatuses((prev) => ({ ...prev, [saleId]: "emitida" }));
    }
    setEmitting(null);
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="relative max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por cliente..."
          className="pl-9"
        />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Cliente</TableHead>
            <TableHead>Veículo</TableHead>
            <TableHead>Forma de pagamento</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead className="text-right">Valor</TableHead>
            <TableHead>Nota fiscal</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="text-center text-sm text-muted-foreground"
              >
                Nenhuma venda encontrada.
              </TableCell>
            </TableRow>
          )}
          {filtered.map((sale) => {
            const invoiceStatus = invoiceStatuses[sale.id] ?? "pendente";
            return (
              <TableRow key={sale.id}>
                <TableCell className="text-muted-foreground">
                  {new Date(sale.date).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="font-medium">{sale.customerName}</TableCell>
                <TableCell>
                  {sale.vehicleBrand} {sale.vehicleModel}
                </TableCell>
                <TableCell>{paymentMethodLabel[sale.paymentMethod]}</TableCell>
                <TableCell>{sale.vendedorName}</TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(sale.amount)}
                </TableCell>
                <TableCell>
                  {invoiceStatus === "pendente" ? (
                    <Button
                      size="sm"
                      variant="outline"
                      className="cursor-pointer"
                      disabled={emitting === sale.id}
                      onClick={() => handleEmit(sale.id)}
                    >
                      {emitting === sale.id ? "Emitindo..." : "Emitir nota fiscal"}
                    </Button>
                  ) : (
                    <InvoiceStatusBadge status={invoiceStatus} />
                  )}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
