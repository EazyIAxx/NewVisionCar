import { CustomersTable } from "@/components/clientes/customers-table";
import { CustomerFormDialog } from "@/components/clientes/customer-form-dialog";
import { mockCustomers } from "@/lib/mock/customers";

export default function ClientesPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Clientes</h1>
          <p className="text-sm text-muted-foreground">
            Contato, status e histórico de compras — consolidado a partir do
            CRM e das vendas.
          </p>
        </div>
        <CustomerFormDialog />
      </div>
      <CustomersTable customers={mockCustomers} />
    </div>
  );
}
