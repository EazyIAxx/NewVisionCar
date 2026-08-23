import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCurrency } from "@/lib/utils";
import { mockSales } from "@/app/(dashboard)/financeiro/mock-data";

export default function VendasPage() {
  const sales = [...mockSales].sort((a, b) => (a.saleDate < b.saleDate ? 1 : -1));

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
            const profit = sale.salePrice - sale.costPrice;
            return (
              <TableRow key={sale.id}>
                <TableCell className="text-muted-foreground">
                  {new Date(sale.saleDate).toLocaleDateString("pt-BR")}
                </TableCell>
                <TableCell className="font-medium">
                  {sale.vehicleBrand} {sale.vehicleModel}
                </TableCell>
                <TableCell>{sale.vendedorName}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(sale.salePrice)}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
                  {formatCurrency(sale.costPrice)}
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
