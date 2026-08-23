import { mockSales } from "@/lib/mock/sales";
import { SaleFormDialog } from "@/components/vendas/sale-form-dialog";
import { SalesTable } from "@/components/vendas/sales-table";

export default function VendasPage() {
  const sales = [...mockSales].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Vendas</h1>
          <p className="text-sm text-muted-foreground">
            Todas as vendas registradas pela equipe.
          </p>
        </div>
        <SaleFormDialog />
      </div>
      <SalesTable sales={sales} />
    </div>
  );
}
