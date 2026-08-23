import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth/get-profile";
import { FiscalSettingsPanel } from "@/components/settings/fiscal/fiscal-settings-panel";
import { mockFiscalSettings } from "@/lib/mock/invoices";

export default async function FiscalPage() {
  const profile = await getCurrentProfile();

  if (profile?.role !== "gestor" || !profile.agency_id) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Fiscal</h1>
        <p className="text-sm text-muted-foreground">
          Dados usados na emissão de nota fiscal das vendas.
        </p>
      </div>
      <FiscalSettingsPanel initialSettings={mockFiscalSettings} />
    </div>
  );
}
