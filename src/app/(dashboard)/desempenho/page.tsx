import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth/get-profile";
import { MyPerformance } from "@/components/desempenho/my-performance";
import { DesempenhoDashboard } from "@/components/desempenho/desempenho-dashboard";
import {
  computePerformance,
  calculateVendedorCommission,
} from "@/app/(dashboard)/desempenho/mock-data";
import { fetchCommissionRates } from "@/lib/data/commission-rates";
import { fetchSales } from "@/lib/data/sales";

export default async function DesempenhoPage() {
  const profile = await getCurrentProfile();
  if (!profile?.role) {
    redirect("/login");
  }

  const [sales, rates] = await Promise.all([fetchSales(), fetchCommissionRates()]);
  const performance = computePerformance(sales);

  if (profile.role === "vendedor") {
    const vendedor =
      performance.find((v) => v.id === profile.id) ?? performance[0];

    if (!vendedor) {
      return (
        <div className="flex flex-col gap-6">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Meu desempenho
            </h1>
            <p className="text-sm text-muted-foreground">
              Você ainda não tem vendas registradas.
            </p>
          </div>
        </div>
      );
    }

    const commission = calculateVendedorCommission(sales, vendedor.id, rates);

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
        <MyPerformance data={{ ...vendedor, commission }} />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Desempenho</h1>
        <p className="text-sm text-muted-foreground">
          Ranking de vendedores e comissão por forma de pagamento.
        </p>
      </div>
      <DesempenhoDashboard
        performance={performance}
        sales={sales}
        initialRates={rates}
      />
    </div>
  );
}
