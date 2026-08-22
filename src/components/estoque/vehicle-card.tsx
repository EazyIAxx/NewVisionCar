import Image from "next/image";
import Link from "next/link";
import { Car } from "lucide-react";

import { Card } from "@/components/ui/card";
import { formatCurrency, formatKm } from "@/lib/utils";
import type { Vehicle, VehicleStatus } from "@/lib/types/vehicle";
import { StatusBadge } from "@/components/estoque/status-badge";
import { StatusQuickMenu } from "@/components/estoque/status-quick-menu";

export function VehicleCard({
  vehicle,
  onStatusChange,
}: {
  vehicle: Vehicle;
  onStatusChange: (
    vehicleId: string,
    status: VehicleStatus,
  ) => Promise<{ error: string | null }>;
}) {
  const photo = vehicle.photos[0];

  return (
    <Card className="overflow-hidden py-0 gap-0">
      <Link href={`/estoque/${vehicle.id}`} className="block">
        <div className="relative aspect-[4/3] w-full bg-muted">
          {photo ? (
            <Image
              src={photo}
              alt={`${vehicle.brand} ${vehicle.model}`}
              fill
              className="object-cover"
              sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-muted-foreground">
              <Car className="size-10" />
            </div>
          )}
          <StatusBadge status={vehicle.status} className="absolute left-2 top-2" />
        </div>
      </Link>
      <div className="flex flex-col gap-1 p-4">
        <Link href={`/estoque/${vehicle.id}`}>
          <p className="truncate font-medium hover:underline">
            {vehicle.brand} {vehicle.model}
          </p>
        </Link>
        <p className="text-sm text-muted-foreground">
          {vehicle.year} · {formatKm(vehicle.km)} · {vehicle.color}
        </p>
        <p className="mt-1 text-lg font-semibold text-primary">
          {formatCurrency(vehicle.price)}
        </p>
        <div className="mt-3">
          <StatusQuickMenu
            vehicleId={vehicle.id}
            status={vehicle.status}
            onChange={onStatusChange}
          />
        </div>
      </div>
    </Card>
  );
}
