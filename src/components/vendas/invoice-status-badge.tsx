import { cn } from "@/lib/utils";
import { invoiceStatusLabel, type InvoiceStatus } from "@/lib/types/invoice";

const statusClassName: Record<InvoiceStatus, string> = {
  emitida: "bg-status-available/15 text-status-available",
  pendente: "bg-status-reserved/15 text-status-reserved",
  cancelada: "bg-status-lost/15 text-status-lost",
};

export function InvoiceStatusBadge({
  status,
  className,
}: {
  status: InvoiceStatus;
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
      {invoiceStatusLabel[status]}
    </span>
  );
}
