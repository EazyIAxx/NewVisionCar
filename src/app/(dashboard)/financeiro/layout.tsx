import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth/get-profile";
import { FinanceTabs } from "@/components/financeiro/finance-tabs";

export default async function FinanceiroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();
  if (profile?.role !== "gestor") {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Financeiro</h1>
        <p className="text-sm text-muted-foreground">
          Faturamento, despesas e lucro líquido da sua revenda.
        </p>
      </div>
      <FinanceTabs />
      {children}
    </div>
  );
}
