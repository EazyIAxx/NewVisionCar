"use server";

import type { FiscalSettings } from "@/lib/types/invoice";

export type ActionResult = { error: string | null };

// TODO(M10 backend): substituir por update real em `agencies` (dados fiscais).
export async function saveFiscalSettings(settings: FiscalSettings): Promise<ActionResult> {
  console.log("save fiscal settings (mock)", settings);
  return { error: null };
}
