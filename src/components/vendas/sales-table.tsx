"use client";

import { useState } from "react";
import { Search } from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";
import type { Sale } from "@/lib/types/sale";
import { paymentMethodLabel } from "@/lib/types/sale";

export function SalesTable({ sales }: { sales: Sale[] }) {
  const [query, setQuery] = useState("");

  const filtered = sales.filter((sale) =>
    sale.customerName.toLowerCase().includes(query.trim().toLowerCase()),
  );

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
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={6}
                className="text-center text-sm text-muted-foreground"
              >
                Nenhuma venda encontrada.
              </TableCell>
            </TableRow>
          )}
          {filtered.map((sale) => (
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
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
