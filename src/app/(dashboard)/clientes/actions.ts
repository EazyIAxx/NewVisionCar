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

// TODO(backend): substituir por delete real (cliente avulso) ou arquivamento
// do lead vinculado — cliente com vendas associadas não deve apagar o
// histórico de vendas, só deixar de aparecer na listagem de clientes.
export async function deleteCustomer(customerId: string): Promise<ActionResult> {
  console.log("delete customer (mock)", customerId);
  return { error: null };
}
