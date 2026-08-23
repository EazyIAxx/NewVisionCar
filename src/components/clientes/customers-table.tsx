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
import type { Customer } from "@/lib/types/customer";
import { CustomerStatusBadge } from "@/components/clientes/status-badge";
import { CustomerDetailDialog } from "@/components/clientes/customer-detail-dialog";

export function CustomersTable({ customers: initialCustomers }: { customers: Customer[] }) {
  const [customers, setCustomers] = useState(initialCustomers);
  const [selected, setSelected] = useState<Customer | null>(null);
  const [query, setQuery] = useState("");

  const filtered = customers.filter((customer) =>
    customer.name.toLowerCase().includes(query.trim().toLowerCase()),
  );

  function handleDelete(customerId: string) {
    setCustomers((prev) => prev.filter((customer) => customer.id !== customerId));
  }

  return (
    <>
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
            <TableHead>Nome</TableHead>
            <TableHead>Contato</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Compras</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filtered.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={5}
                className="text-center text-sm text-muted-foreground"
              >
                Nenhum cliente encontrado.
              </TableCell>
            </TableRow>
          )}
          {filtered.map((customer) => (
            <TableRow
              key={customer.id}
              className="cursor-pointer"
              onClick={() => setSelected(customer)}
            >
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell className="text-muted-foreground">
                {customer.phone ?? "—"}
              </TableCell>
              <TableCell>{customer.vendedorName}</TableCell>
              <TableCell>
                <CustomerStatusBadge status={customer.status} />
              </TableCell>
              <TableCell className="text-right">
                {customer.purchases.length}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selected && (
        <CustomerDetailDialog
          customer={selected}
          open={!!selected}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
          onDelete={handleDelete}
        />
      )}
    </>
  );
}
