import { cn } from "@/lib/utils";
import { customerStatusLabel, type CustomerStatus } from "@/lib/types/customer";

const statusClassName: Record<CustomerStatus, string> = {
  cliente: "bg-status-sold/15 text-status-sold",
  em_andamento: "bg-status-reserved/15 text-status-reserved",
  perdido: "bg-status-lost/15 text-status-lost",
};

export function CustomerStatusBadge({
  status,
  className,
}: {
  status: CustomerStatus;
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
      {customerStatusLabel[status]}
    </span>
  );
}
