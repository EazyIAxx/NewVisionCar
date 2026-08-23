"use server";

import type { PlanId } from "@/lib/types/billing";

export type ActionResult = { error: string | null };

// TODO(M7 backend): criar uma Stripe Checkout Session real (mode: "subscription")
// e redirecionar pra `session.url`, em vez de só logar.
export async function createCheckoutSession(planId: PlanId): Promise<ActionResult> {
  console.log("create checkout session (mock)", planId);
  return { error: null };
}

// TODO(M7 backend): criar uma Stripe Billing Portal Session real e redirecionar
// pra `session.url`, em vez de só logar.
export async function createPortalSession(): Promise<ActionResult> {
  console.log("create billing portal session (mock)");
  return { error: null };
}
