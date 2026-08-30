import { NextResponse, type NextRequest } from "next/server";
import { createClient as createSupabaseAdminClient } from "@supabase/supabase-js";
import type Stripe from "stripe";

import { stripe } from "@/lib/stripe/server";
import type { Database } from "@/lib/types/database.types";

// Service role — só este webhook (chamado pelo Stripe, sem sessão de
// usuário) precisa bypassar RLS pra gravar plan_status/stripe_customer_id.
// Essas colunas são bloqueadas pra escrita de `authenticated` de propósito
// (ver migration 0023) — só o webhook, verificado por assinatura, escreve.
const supabaseAdmin = createSupabaseAdminClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

function mapSubscriptionStatus(
  status: Stripe.Subscription.Status,
): "active" | "past_due" | "canceled" | null {
  switch (status) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
    case "unpaid":
    case "incomplete":
      return "past_due";
    case "canceled":
    case "incomplete_expired":
    case "paused":
      return "canceled";
    default:
      return null;
  }
}

const TIER_BY_PRICE_ID: Record<string, "basico" | "com_ia"> = {
  ...(process.env.STRIPE_PRICE_ID_BASICO
    ? { [process.env.STRIPE_PRICE_ID_BASICO]: "basico" }
    : {}),
  ...(process.env.STRIPE_PRICE_ID_IA ? { [process.env.STRIPE_PRICE_ID_IA]: "com_ia" } : {}),
};

function tierFromSubscription(subscription: Stripe.Subscription): "basico" | "com_ia" | null {
  const priceId = subscription.items.data[0]?.price.id;
  return priceId ? (TIER_BY_PRICE_ID[priceId] ?? null) : null;
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!,
    );
  } catch (err) {
    return NextResponse.json(
      { error: `Webhook signature invalid: ${(err as Error).message}` },
      { status: 400 },
    );
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const agencyId = session.metadata?.agency_id;
      const planTier = session.metadata?.plan_tier;
      if (!agencyId || !session.customer || !session.subscription) break;

      await supabaseAdmin
        .from("agencies")
        .update({
          stripe_customer_id: String(session.customer),
          stripe_subscription_id: String(session.subscription),
          plan_status: "active",
          ...(planTier === "basico" || planTier === "com_ia" ? { plan_tier: planTier } : {}),
        })
        .eq("id", agencyId);
      break;
    }

    case "customer.subscription.updated": {
      const subscription = event.data.object as Stripe.Subscription;
      const status = mapSubscriptionStatus(subscription.status);
      if (!status) break;
      const tier = tierFromSubscription(subscription);

      await supabaseAdmin
        .from("agencies")
        .update({
          plan_status: status,
          stripe_subscription_id: subscription.id,
          ...(tier ? { plan_tier: tier } : {}),
        })
        .eq("stripe_customer_id", String(subscription.customer));
      break;
    }

    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;

      await supabaseAdmin
        .from("agencies")
        .update({ plan_status: "canceled" })
        .eq("stripe_customer_id", String(subscription.customer));
      break;
    }

    case "invoice.payment_failed": {
      const invoice = event.data.object as Stripe.Invoice;
      if (!invoice.customer) break;

      await supabaseAdmin
        .from("agencies")
        .update({ plan_status: "past_due" })
        .eq("stripe_customer_id", String(invoice.customer));
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}
