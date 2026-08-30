"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import { stripe } from "@/lib/stripe/server";

export type CheckoutResult = { error: string | null; url?: string };

export async function createCheckoutSession(): Promise<CheckoutResult> {
  const profile = await getCurrentProfile();
  if (profile?.role !== "gestor" || !profile.agency_id) {
    return { error: "Apenas o gestor pode assinar." };
  }

  const supabase = await createClient();
  const { data: agency } = await supabase
    .from("agencies")
    .select("stripe_customer_id")
    .eq("id", profile.agency_id)
    .single();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      client_reference_id: profile.agency_id,
      ...(agency?.stripe_customer_id
        ? { customer: agency.stripe_customer_id }
        : { customer_email: profile.email ?? undefined }),
      line_items: [{ price: process.env.STRIPE_PRICE_ID!, quantity: 1 }],
      success_url: `${appUrl}/settings/billing?checkout=success`,
      cancel_url: `${appUrl}/settings/billing?checkout=canceled`,
    });

    if (!session.url) return { error: "Não foi possível iniciar o checkout." };
    return { error: null, url: session.url };
  } catch (err) {
    return { error: (err as Error).message };
  }
}

export async function createPortalSession(): Promise<CheckoutResult> {
  const profile = await getCurrentProfile();
  if (profile?.role !== "gestor" || !profile.agency_id) {
    return { error: "Apenas o gestor pode gerenciar a assinatura." };
  }

  const supabase = await createClient();
  const { data: agency } = await supabase
    .from("agencies")
    .select("stripe_customer_id")
    .eq("id", profile.agency_id)
    .single();

  if (!agency?.stripe_customer_id) {
    return { error: "Assine um plano antes de gerenciar a assinatura." };
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: agency.stripe_customer_id,
      return_url: `${appUrl}/settings/billing`,
    });

    return { error: null, url: session.url };
  } catch (err) {
    return { error: (err as Error).message };
  }
}
