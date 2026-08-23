import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth/get-profile";
import { Leaderboard } from "@/components/desempenho/leaderboard";
import { MyPerformance } from "@/components/desempenho/my-performance";
import { mockPerformance } from "@/app/(dashboard)/desempenho/mock-data";
import { COMMISSION_RATE } from "@/lib/types/performance";

export default async function DesempenhoPage() {
  const profile = await getCurrentProfile();
  if (!profile?.role) {
    redirect("/login");
  }

  const ranking = mockPerformance
    .map((vendedor) => ({
      ...vendedor,
      commission: vendedor.totalSold * COMMISSION_RATE,
    }))
    .sort((a, b) => b.totalSold - a.totalSold);

  if (profile.role === "vendedor") {
    // TODO(M5 backend): trocar por vendas reais filtradas por vendedor_id = auth.uid() (RLS).
    const mine =
      ranking.find((vendedor) => vendedor.name === profile.full_name) ??
      ranking[0];

    return (
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">
            Meu desempenho
          </h1>
          <p className="text-sm text-muted-foreground">
            Seus números não são visíveis para outros vendedores.
          </p>
        </div>
        <MyPerformance data={mine} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Desempenho</h1>
        <p className="text-sm text-muted-foreground">
          Ranking de vendedores e comissão (0,5% por veículo vendido).
        </p>
      </div>
      <Leaderboard ranking={ranking} />
    </div>
  );
}
