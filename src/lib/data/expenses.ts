import "server-only";

import { createClient } from "@/lib/supabase/server";
import type { Expense } from "@/lib/types/finance";

export async function fetchExpenses(): Promise<Expense[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("expenses")
    .select("*")
    .order("date", { ascending: false });

  return (data ?? []).map((row) => ({
    id: row.id,
    category: row.category as Expense["category"],
    description: row.description,
    amount: Number(row.amount),
    date: row.date,
  }));
}
