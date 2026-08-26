import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { PaymentMethod, Sale } from "@/lib/types/sale";

export async function fetchSales(): Promise<Sale[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("sales_view")
    .select("*")
    .order("sale_date", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id!,
    customerName: row.customer_name!,
    vehicleBrand: row.vehicle_brand!,
    vehicleModel: row.vehicle_model!,
    costPrice: row.cost_price === null ? null : Number(row.cost_price),
    amount: Number(row.amount),
    paymentMethod: row.payment_method as PaymentMethod,
    date: row.sale_date!,
    vendedorId: row.vendedor_id!,
    vendedorName: row.vendedor_name!,
  }));
}
