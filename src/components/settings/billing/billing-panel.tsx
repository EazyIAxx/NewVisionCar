"use client";

import { useState } from "react";
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
import { PLANS } from "@/lib/billing/plan";
import { subscriptionStatusLabel, type Subscription } from "@/lib/types/billing";
import {
  createCheckoutSession,
  createPortalSession,
} from "@/app/(dashboard)/settings/billing/actions";

export function BillingPanel({ subscription }: { subscription: Subscription }) {
  const [loadingTier, setLoadingTier] = useState<string | null>(null);
  const [isRedirectingPortal, setIsRedirectingPortal] = useState(false);

  const trialDaysLeft = subscription.trialEndsAt
    ? Math.max(
        0,
        differenceInCalendarDays(new Date(subscription.trialEndsAt), new Date()),
      )
    : null;

  const isSubscribed = subscription.status === "active";

  async function handleSubscribe(tier: (typeof PLANS)[number]["tier"]) {
    setLoadingTier(tier);
    const result = await createCheckoutSession(tier);
    if (result?.error || !result?.url) {
      toast.error(result?.error ?? "Não foi possível iniciar o checkout.");
      setLoadingTier(null);
      return;
    }
    window.location.href = result.url;
  }

  async function handleManage() {
    setIsRedirectingPortal(true);
    const result = await createPortalSession();
    if (result?.error || !result?.url) {
      toast.error(result?.error ?? "Não foi possível abrir o portal.");
      setIsRedirectingPortal(false);
      return;
    }
    window.location.href = result.url;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col items-start justify-between gap-4 rounded-xl border bg-muted/30 p-4 sm:flex-row sm:items-center">
        <div>
          <p className="font-medium">{subscriptionStatusLabel[subscription.status]}</p>
          <p className="text-sm text-muted-foreground">
            {subscription.status === "trial" && trialDaysLeft !== null
              ? `${trialDaysLeft} dia${trialDaysLeft === 1 ? "" : "s"} restante${trialDaysLeft === 1 ? "" : "s"} — sem cartão de crédito.`
              : subscription.status === "past_due"
                ? "Regularize o pagamento pra continuar usando a plataforma."
                : subscription.status === "canceled"
                  ? "Assine novamente pra recuperar o acesso."
                  : null}
          </p>
        </div>
        {isSubscribed && (
          <Button
            variant="outline"
            className="cursor-pointer"
            disabled={isRedirectingPortal}
            onClick={handleManage}
          >
            {isRedirectingPortal ? "Abrindo..." : "Gerenciar assinatura"}
          </Button>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {PLANS.map((plan) => {
          const isCurrentPlan = isSubscribed && subscription.planTier === plan.tier;
          return (
            <div key={plan.tier} className="relative">
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
                        !isCurrentPlan &&
                        "bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110",
                    )}
                    variant={plan.highlight && !isCurrentPlan ? "default" : "outline"}
                    disabled={loadingTier === plan.tier || isCurrentPlan}
                    onClick={() => handleSubscribe(plan.tier)}
                  >
                    {loadingTier === plan.tier
                      ? "Redirecionando..."
                      : isCurrentPlan
                        ? "Plano atual"
                        : "Assinar"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>
    </div>
  );
}
