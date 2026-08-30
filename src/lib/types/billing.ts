export type SubscriptionStatus = "trial" | "active" | "past_due" | "canceled";

export const subscriptionStatusLabel: Record<SubscriptionStatus, string> = {
  trial: "Período de teste",
  active: "Assinatura ativa",
  past_due: "Pagamento pendente",
  canceled: "Assinatura cancelada",
};

export type PlanTier = "basico" | "com_ia";

export type Subscription = {
  status: SubscriptionStatus;
  planTier: PlanTier | null;
  trialEndsAt: string | null; // ISO
};
