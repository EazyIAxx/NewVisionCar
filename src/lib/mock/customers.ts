import { mockLeads } from "@/app/(dashboard)/crm/mock-data";
import { mockSales } from "@/lib/mock/sales";
import type { Customer } from "@/lib/types/customer";
import type { Lead } from "@/lib/types/lead";

// TODO(backend): substituir por view/join real entre `leads` e `sales` (ou uma
// tabela `customers` própria), casando por customer_id em vez de nome — aqui é
// só uma consolidação de mocks já existentes (CRM + Vendas), sem novo cadastro.
function pickLatestLead(leads: Lead[]): Lead {
  return [...leads].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
}

const leadsByName = new Map<string, Lead[]>();
for (const lead of mockLeads) {
  leadsByName.set(lead.name, [...(leadsByName.get(lead.name) ?? []), lead]);
}

const salesByName = new Map<string, typeof mockSales>();
for (const sale of mockSales) {
  salesByName.set(sale.customerName, [
    ...(salesByName.get(sale.customerName) ?? []),
    sale,
  ]);
}

const names = new Set([...leadsByName.keys(), ...salesByName.keys()]);

export const mockCustomers: Customer[] = Array.from(names)
  .map((name) => {
    const leads = leadsByName.get(name) ?? [];
    const purchases = salesByName.get(name) ?? [];
    const latestLead = leads.length > 0 ? pickLatestLead(leads) : null;

    const status =
      purchases.length > 0
        ? "cliente"
        : latestLead?.stage === "perdido"
          ? "perdido"
          : "em_andamento";

    return {
      id: name,
      name,
      phone: latestLead?.phone ?? null,
      email: latestLead?.email ?? null,
      vendedorName:
        latestLead?.vendedorName ?? purchases[0]?.vendedorName ?? "—",
      status,
      leadStage: latestLead?.stage ?? null,
      vehicleInterest: latestLead?.vehicleInterest ?? null,
      purchases,
    } satisfies Customer;
  })
  .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
