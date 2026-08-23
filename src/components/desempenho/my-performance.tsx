import { Car, DollarSign, Trophy } from "lucide-react";

import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
import type { VendedorPerformanceWithCommission } from "@/lib/types/performance";

export function MyPerformance({
  data,
}: {
  data: VendedorPerformanceWithCommission;
}) {
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <Car className="size-4" /> Veículos vendidos
          </CardDescription>
          <CardTitle className="text-2xl">{data.vehiclesSold}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <DollarSign className="size-4" /> Total vendido
          </CardDescription>
          <CardTitle className="text-2xl">
            {formatCurrency(data.totalSold)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription className="flex items-center gap-1.5">
            <Trophy className="size-4" /> Sua comissão
          </CardDescription>
          <CardTitle className="text-2xl text-status-available">
            {formatCurrency(data.commission)}
          </CardTitle>
        </CardHeader>
      </Card>
      <p className="col-span-full text-sm text-muted-foreground">
        Comissão varia por forma de pagamento, conforme regra definida pelo
        Gestor.
      </p>
    </div>
  );
}
