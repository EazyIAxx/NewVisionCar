import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { FinancingRequest } from "@/lib/types/financing";

export async function fetchFinancingRequestsByVehicleId(
  vehicleId: string,
): Promise<FinancingRequest[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("financing_requests")
    .select("*")
    .eq("vehicle_id", vehicleId)
    .order("created_at", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id,
    vehicleId: row.vehicle_id,
    leadId: row.lead_id,
    status: row.status as FinancingRequest["status"],
    customerName: row.customer_name,
    customerPhone: row.customer_phone,
    customerEmail: row.customer_email,
    downPayment: Number(row.down_payment),
    termMonths: row.term_months,
    installmentEstimate: Number(row.installment_estimate),
    createdAt: row.created_at,
  }));
}
