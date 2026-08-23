import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { mockSales } from "@/lib/mock/sales";
import { paymentMethodLabel } from "@/lib/types/sale";
import { SaleFormDialog } from "@/components/vendas/sale-form-dialog";

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
          {sales.map((sale) => (
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
