import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { ServiceOrder } from "@/lib/types/service-order";

export async function fetchServiceOrders(vehicleId: string): Promise<ServiceOrder[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("service_orders")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .order("date", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id,
    vehicleId: row.vehicle_id,
    type: row.type as ServiceOrder["type"],
    supplier: row.supplier,
    amount: Number(row.amount),
    status: row.status as ServiceOrder["status"],
    date: row.date,
  }));
}
