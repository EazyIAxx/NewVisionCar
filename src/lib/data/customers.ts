import "server-only";

import { fetchLeads } from "@/lib/data/leads";
import { fetchSales } from "@/lib/data/sales";
import type { Customer } from "@/lib/types/customer";
import type { Lead } from "@/lib/types/lead";
import type { Sale } from "@/lib/types/sale";

function pickLatestLead(leads: Lead[]): Lead {
  return [...leads].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))[0];
}

export async function getCustomers(): Promise<Customer[]> {
  const [leads, sales] = await Promise.all([fetchLeads(), fetchSales()]);

  const leadsByName = new Map<string, Lead[]>();
  for (const lead of leads) {
    leadsByName.set(lead.name, [...(leadsByName.get(lead.name) ?? []), lead]);
  }

  const salesByName = new Map<string, Sale[]>();
  for (const sale of sales) {
    salesByName.set(sale.customerName, [
      ...(salesByName.get(sale.customerName) ?? []),
      sale,
    ]);
  }

  const names = new Set([...leadsByName.keys(), ...salesByName.keys()]);

  return Array.from(names)
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
}
