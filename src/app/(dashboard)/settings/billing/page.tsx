import { redirect } from "next/navigation";

import { getCurrentProfile } from "@/lib/auth/get-profile";
import { BillingPanel } from "@/components/settings/billing/billing-panel";
import { mockPlans, mockSubscription } from "@/lib/mock/billing";

export default async function BillingPage() {
  const profile = await getCurrentProfile();

  if (profile?.role !== "gestor" || !profile.agency_id) {
    redirect("/dashboard");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Assinatura</h1>
        <p className="text-sm text-muted-foreground">
          Escolha o plano ideal para o tamanho da sua revenda.
        </p>
      </div>
      <BillingPanel plans={mockPlans} subscription={mockSubscription} />
    </div>
  );
}
