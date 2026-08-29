import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { RenaveTransfer } from "@/lib/types/renave";

export async function fetchRenaveTransfersBySaleId(): Promise<Record<string, RenaveTransfer>> {
  const supabase = await createClient();
  const { data } = await supabase.from("renave_transfers").select("*");

  const map: Record<string, RenaveTransfer> = {};
  for (const row of data ?? []) {
    map[row.sale_id] = {
      id: row.id,
      saleId: row.sale_id,
      status: row.status as RenaveTransfer["status"],
      buyerDocument: row.buyer_document,
      buyerRg: row.buyer_rg,
      buyerAddress: row.buyer_address,
      protocol: row.protocol,
      updatedAt: row.updated_at,
    };
  }
  return map;
}
