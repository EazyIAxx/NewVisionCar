import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import { BillingPanel } from "@/components/settings/billing/billing-panel";
import type { Subscription } from "@/lib/types/billing";

export default async function BillingPage() {
  const profile = await getCurrentProfile();

  if (profile?.role !== "gestor" || !profile.agency_id) {
    redirect("/dashboard");
  }

  const supabase = await createClient();
  const { data: agency } = await supabase
    .from("agencies")
    .select("plan_status, plan_tier, trial_ends_at")
    .eq("id", profile.agency_id)
    .single();

  const subscription: Subscription = {
    status: (agency?.plan_status as Subscription["status"]) ?? "trial",
    planTier: (agency?.plan_tier as Subscription["planTier"]) ?? null,
    trialEndsAt: agency?.trial_ends_at ?? null,
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Assinatura</h1>
        <p className="text-sm text-muted-foreground">
          Gerencie a assinatura da sua revenda.
        </p>
      </div>
      <BillingPanel subscription={subscription} />
    </div>
  );
}
