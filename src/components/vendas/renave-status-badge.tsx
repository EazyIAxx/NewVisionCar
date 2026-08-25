import { cn } from "@/lib/utils";
import { renaveStatusLabel, type RenaveStatus } from "@/lib/types/renave";

const statusClassName: Record<RenaveStatus, string> = {
  concluida: "bg-status-available/15 text-status-available",
  em_andamento: "bg-status-reserved/15 text-status-reserved",
  pendente: "bg-muted text-muted-foreground",
  erro: "bg-status-lost/15 text-status-lost",
};

export function RenaveStatusBadge({
  status,
  className,
}: {
  status: RenaveStatus;
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
      {renaveStatusLabel[status]}
    </span>
  );
}
