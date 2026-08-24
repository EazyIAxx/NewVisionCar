import { cn } from "@/lib/utils";
import {
  serviceOrderStatusLabel,
  type ServiceOrderStatus,
} from "@/lib/types/service-order";

const statusClassName: Record<ServiceOrderStatus, string> = {
  concluida: "bg-status-available/15 text-status-available",
  em_andamento: "bg-status-reserved/15 text-status-reserved",
  pendente: "bg-muted text-muted-foreground",
};

export function ServiceOrderStatusBadge({
  status,
  className,
}: {
  status: ServiceOrderStatus;
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
      {serviceOrderStatusLabel[status]}
    </span>
  );
}
