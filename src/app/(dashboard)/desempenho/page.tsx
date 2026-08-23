import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth/get-profile";
import { MyPerformance } from "@/components/desempenho/my-performance";
import { DesempenhoDashboard } from "@/components/desempenho/desempenho-dashboard";
import {
  mockPerformance,
  calculateVendedorCommission,
} from "@/app/(dashboard)/desempenho/mock-data";
import { defaultCommissionRates } from "@/lib/mock/commission-rates";

export default async function DesempenhoPage() {
  const profile = await getCurrentProfile();
  if (!profile?.role) {
    redirect("/login");
  }

  if (profile.role === "vendedor") {
    // TODO(M5 backend): trocar por vendas reais filtradas por vendedor_id = auth.uid() (RLS).
    const vendedor =
      mockPerformance.find((v) => v.name === profile.full_name) ?? mockPerformance[0];
    const commission = calculateVendedorCommission(vendedor.name, defaultCommissionRates);

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
        performance={mockPerformance}
        initialRates={defaultCommissionRates}
      />
    </div>
  );
}
