"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import type { ExpenseCategory } from "@/lib/types/finance";

export type ActionResult = { error: string | null };

type ExpenseInput = {
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
};

export async function createExpense(input: ExpenseInput): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Sessão inválida." };

  const supabase = await createClient();
  const { error } = await supabase.from("expenses").insert({
    agency_id: profile.agency_id,
    category: input.category,
    description: input.description,
    amount: input.amount,
    date: input.date,
  });

  return { error: error?.message ?? null };
}

export async function deleteExpense(expenseId: string): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (profile?.role !== "gestor") {
    return { error: "Apenas o gestor pode excluir despesas." };
  }

  const supabase = await createClient();
  const { error } = await supabase.from("expenses").delete().eq("id", expenseId);
  return { error: error?.message ?? null };
}
