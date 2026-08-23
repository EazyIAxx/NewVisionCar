import { Car, Trophy } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import type { VendedorPerformanceWithCommission } from "@/lib/types/performance";

export function Leaderboard({
  ranking,
}: {
  ranking: VendedorPerformanceWithCommission[];
}) {
  return (
    <div className="flex flex-col gap-3">
      {ranking.map((vendedor, index) => {
        const isFirst = index === 0;
        return (
          <Card
            key={vendedor.id}
            className={cn(
              "flex-row items-center gap-4 p-4",
              isFirst && "border-primary/40",
            )}
          >
            <span
              className={cn(
                "flex size-10 shrink-0 items-center justify-center rounded-full text-sm font-semibold",
                isFirst
                  ? "bg-gradient-to-br from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {isFirst ? <Trophy className="size-4" /> : index + 1}
            </span>

            <div className="min-w-0 flex-1">
              <p className="truncate font-medium">{vendedor.name}</p>
              <p className="flex items-center gap-1 text-sm text-muted-foreground">
                <Car className="size-3.5" />
                {vendedor.vehiclesSold} veículo
                {vendedor.vehiclesSold === 1 ? "" : "s"} vendido
                {vendedor.vehiclesSold === 1 ? "" : "s"}
              </p>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">
                {formatCurrency(vendedor.totalSold)}
              </p>
              <p className="font-semibold text-status-available">
                {formatCurrency(vendedor.commission)}
              </p>
            </div>
          </Card>
        );
      })}
    </div>
  );
}
