"use server";

import type { VitrineSettings } from "@/lib/types/vitrine";

export type ActionResult = { error: string | null };

// TODO(M12 backend): substituir por update real em `agencies` (slug, nome de
// exibição e cor de destaque da vitrine).
export async function saveVitrineSettings(settings: VitrineSettings): Promise<ActionResult> {
  console.log("save vitrine settings (mock)", settings);
  return { error: null };
}
