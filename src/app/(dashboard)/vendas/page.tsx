import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import { fetchSales } from "@/lib/data/sales";
import { SaleFormDialog } from "@/components/vendas/sale-form-dialog";
import { SalesTable } from "@/components/vendas/sales-table";

export default async function VendasPage() {
  const profile = await getCurrentProfile();
  const sales = await fetchSales();

  const supabase = await createClient();
  const { data: members } = profile?.agency_id
    ? await supabase
        .from("profiles")
        .select("id, full_name")
        .eq("agency_id", profile.agency_id)
        .order("full_name", { ascending: true })
    : { data: null };

  const vendedores = (members ?? [])
    .filter((m): m is { id: string; full_name: string } => !!m.full_name)
    .map((m) => ({ id: m.id, fullName: m.full_name }));

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Vendas</h1>
          <p className="text-sm text-muted-foreground">
            Todas as vendas registradas pela equipe.
          </p>
        </div>
        <SaleFormDialog vendedores={vendedores} />
      </div>
      <SalesTable sales={sales} />
    </div>
  );
}
