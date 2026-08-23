"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";
import { toast } from "sonner";
import { differenceInCalendarDays } from "date-fns";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { cn, formatCurrency } from "@/lib/utils";
import type { Plan, Subscription } from "@/lib/types/billing";
import {
  createCheckoutSession,
  createPortalSession,
} from "@/app/(dashboard)/settings/billing/actions";

export function BillingPanel({
  plans,
  subscription,
}: {
  plans: Plan[];
  subscription: Subscription;
}) {
  const router = useRouter();
  const [loadingPlan, setLoadingPlan] = useState<string | null>(null);
  const [loadingPortal, setLoadingPortal] = useState(false);

  const trialDaysLeft = subscription.trialEndsAt
    ? Math.max(
        0,
        differenceInCalendarDays(new Date(subscription.trialEndsAt), new Date()),
      )
    : null;

  async function handleSubscribe(planId: Plan["id"]) {
    setLoadingPlan(planId);
    const result = await createCheckoutSession(planId);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Redirecionando para o checkout do Stripe...");
      router.refresh();
    }
    setLoadingPlan(null);
  }

  async function handleManage() {
    setLoadingPortal(true);
    const result = await createPortalSession();
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Abrindo o portal de assinatura...");
    }
    setLoadingPortal(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center">
        <div>
          {subscription.status === "trial" ? (
            <>
              <p className="font-medium">Período de teste</p>
              <p className="text-sm text-muted-foreground">
                {trialDaysLeft !== null
                  ? `${trialDaysLeft} dia${trialDaysLeft === 1 ? "" : "s"} restante${trialDaysLeft === 1 ? "" : "s"} — sem cartão de crédito.`
                  : "Sem cartão de crédito."}
              </p>
            </>
          ) : (
            <>
              <p className="font-medium">Assinatura ativa</p>
              <p className="text-sm text-muted-foreground">
                Plano {subscription.planId}
              </p>
            </>
          )}
        </div>
        <Button
          variant="outline"
          className="cursor-pointer"
          disabled={loadingPortal}
          onClick={handleManage}
        >
          {loadingPortal ? "Abrindo..." : "Gerenciar assinatura"}
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {plans.map((plan) => (
          <div key={plan.id} className="relative">
            {plan.highlight && (
              <span className="absolute -top-3 left-1/2 z-10 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] px-3 py-1 text-xs font-medium text-white">
                Mais popular
              </span>
            )}
            <Card className={cn(plan.highlight && "ring-2 ring-primary")}>
            <CardHeader>
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>
                <span className="text-2xl font-semibold text-foreground">
                  {formatCurrency(plan.price)}
                </span>
                /mês
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <ul className="flex flex-col gap-2 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-status-available" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
              <Button
                className={cn(
                  "cursor-pointer",
                  plan.highlight &&
                    "bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110",
                )}
                variant={plan.highlight ? "default" : "outline"}
                disabled={loadingPlan === plan.id}
                onClick={() => handleSubscribe(plan.id)}
              >
                {loadingPlan === plan.id
                  ? "Redirecionando..."
                  : subscription.planId === plan.id
                    ? "Plano atual"
                    : "Assinar"}
              </Button>
            </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}
