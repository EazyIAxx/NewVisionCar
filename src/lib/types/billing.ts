export type SubscriptionStatus = "trial" | "active" | "past_due" | "canceled";

export const subscriptionStatusLabel: Record<SubscriptionStatus, string> = {
  trial: "Período de teste",
  active: "Assinatura ativa",
  past_due: "Pagamento pendente",
  canceled: "Assinatura cancelada",
};

export type Subscription = {
  status: SubscriptionStatus;
  trialEndsAt: string | null; // ISO
};
