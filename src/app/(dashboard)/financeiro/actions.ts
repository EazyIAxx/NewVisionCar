"use server";

import type { ExpenseCategory } from "@/lib/types/finance";

export type ActionResult = { error: string | null };

type ExpenseInput = {
  category: ExpenseCategory;
  description: string;
  amount: number;
  date: string;
};

// TODO(M3 backend): substituir por insert real na tabela `expenses` (RLS gestor-only).
export async function createExpense(input: ExpenseInput): Promise<ActionResult> {
  console.log("create expense (mock)", input);
  return { error: null };
}
