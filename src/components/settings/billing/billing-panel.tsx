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
import { formatCurrency } from "@/lib/utils";
import { PLAN } from "@/lib/billing/plan";
import { subscriptionStatusLabel, type Subscription } from "@/lib/types/billing";
import {
  createCheckoutSession,
  createPortalSession,
} from "@/app/(dashboard)/settings/billing/actions";

export function BillingPanel({ subscription }: { subscription: Subscription }) {
  const [isRedirecting, setIsRedirecting] = useState(false);

  const trialDaysLeft = subscription.trialEndsAt
    ? Math.max(
        0,
        differenceInCalendarDays(new Date(subscription.trialEndsAt), new Date()),
      )
    : null;

  const isSubscribed = subscription.status === "active";

  async function handleSubscribe() {
    setIsRedirecting(true);
    const result = await createCheckoutSession();
    if (result?.error || !result?.url) {
      toast.error(result?.error ?? "Não foi possível iniciar o checkout.");
      setIsRedirecting(false);
      return;
    }
    window.location.href = result.url;
  }

  async function handleManage() {
    setIsRedirecting(true);
    const result = await createPortalSession();
    if (result?.error || !result?.url) {
      toast.error(result?.error ?? "Não foi possível abrir o portal.");
      setIsRedirecting(false);
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
            disabled={isRedirecting}
            onClick={handleManage}
          >
            {isRedirecting ? "Abrindo..." : "Gerenciar assinatura"}
          </Button>
        )}
      </div>

      <div className="mx-auto w-full max-w-sm">
        <Card className="ring-2 ring-primary">
          <CardHeader>
            <CardTitle className="text-lg">{PLAN.name}</CardTitle>
            <CardDescription>
              <span className="text-2xl font-semibold text-foreground">
                {formatCurrency(PLAN.price)}
              </span>
              /mês
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <ul className="flex flex-col gap-2 text-sm">
              {PLAN.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-status-available" />
                  <span className="text-muted-foreground">{feature}</span>
                </li>
              ))}
            </ul>
            {!isSubscribed && (
              <Button
                className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
                disabled={isRedirecting}
                onClick={handleSubscribe}
              >
                {isRedirecting ? "Redirecionando..." : "Assinar"}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
