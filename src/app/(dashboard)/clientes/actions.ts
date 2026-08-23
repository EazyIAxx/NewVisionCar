"use server";

export type ActionResult = { error: string | null };

type CustomerInput = {
  name: string;
  phone: string;
  email?: string;
  vendedorName: string;
};

// TODO(backend): substituir por insert real na tabela `customers` (avulso, sem
// vínculo obrigatório com `leads`/`sales`; RLS: gestor vê todos, vendedor só os seus).
export async function createCustomer(input: CustomerInput): Promise<ActionResult> {
  console.log("create customer (mock)", input);
  return { error: null };
}
