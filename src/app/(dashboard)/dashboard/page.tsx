import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 1).toISOString().slice(0, 10);

  const [
    { count: vehiclesInStock },
    { count: openLeads },
    { count: salesThisMonth },
    { count: renaveInProgress },
  ] = await Promise.all([
    supabase
      .from("vehicles")
      .select("id", { count: "exact", head: true })
      .eq("status", "disponivel"),
    supabase
      .from("leads")
      .select("id", { count: "exact", head: true })
      .not("stage", "in", "(venda_fechada,perdido)"),
    supabase
      .from("sales")
      .select("id", { count: "exact", head: true })
      .gte("sale_date", monthStart)
      .lt("sale_date", monthEnd),
    supabase
      .from("renave_transfers")
      .select("id", { count: "exact", head: true })
      .eq("status", "em_andamento"),
  ]);

  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Card>
        <CardHeader>
          <CardDescription>Veículos em estoque</CardDescription>
          <CardTitle className="text-3xl">{vehiclesInStock ?? 0}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Leads em aberto</CardDescription>
          <CardTitle className="text-3xl">{openLeads ?? 0}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Vendas no mês</CardDescription>
          <CardTitle className="text-3xl">{salesThisMonth ?? 0}</CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>RENAVE em andamento</CardDescription>
          <CardTitle className="text-3xl">{renaveInProgress ?? 0}</CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}
