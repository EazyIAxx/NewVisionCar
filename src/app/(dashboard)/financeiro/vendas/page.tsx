import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { fetchSales } from "@/lib/data/sales";

export default async function VendasPage() {
  const sales = await fetchSales();

  return (
    <div className="flex flex-col gap-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Data</TableHead>
            <TableHead>Veículo</TableHead>
            <TableHead>Vendedor</TableHead>
            <TableHead className="text-right">Venda</TableHead>
            <TableHead className="text-right">Custo</TableHead>
            <TableHead className="text-right">Lucro líquido</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sales.map((sale) => {
            const cost = sale.costPrice ?? 0;
            const profit = sale.amount - cost;
            return (
              <TableRow key={sale.id}>
                <TableCell className="text-muted-foreground">
                  {new Date(sale.date).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="font-medium">
                  {sale.vehicleBrand} {sale.vehicleModel}
                </TableCell>
                <TableCell>{sale.vendedorName}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(sale.amount)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatCurrency(cost)}
                </TableCell>
                <TableCell className="text-right font-medium text-status-available">
                  {formatCurrency(profit)}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
