import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { ListingPortal, ListingStatus } from "@/lib/types/listing";

export async function fetchListingStatuses(
  vehicleId: string,
): Promise<Record<ListingPortal, ListingStatus>> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("listings")
    .select("portal, status")
    .eq("vehicle_id", vehicleId);

  const statuses: Record<ListingPortal, ListingStatus> = {
    olx: "nao_publicado",
    webmotors: "nao_publicado",
  };

  for (const row of data ?? []) {
    statuses[row.portal as ListingPortal] = row.status as ListingStatus;
  }

  return statuses;
}
