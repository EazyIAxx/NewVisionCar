import { CustomersTable } from "@/components/clientes/customers-table";
import { CustomerFormDialog } from "@/components/clientes/customer-form-dialog";
import { getCustomers } from "@/lib/data/customers";

export default async function ClientesPage() {
  const customers = await getCustomers();

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
      <CustomersTable customers={customers} />
    </div>
  );
}
