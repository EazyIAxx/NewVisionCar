import { cn } from "@/lib/utils";
import { vehicleStatusLabel, type VehicleStatus } from "@/lib/types/vehicle";

const statusClassName: Record<VehicleStatus, string> = {
  disponivel: "bg-status-available/15 text-status-available",
  reservado: "bg-status-reserved/15 text-status-reserved",
  vendido: "bg-status-sold/15 text-status-sold",
};

export function StatusBadge({
  status,
  className,
}: {
  status: VehicleStatus;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        statusClassName[status],
        className,
      )}
    >
      {vehicleStatusLabel[status]}
    </span>
  );
}
