export type PlanId = "start" | "profissional" | "ilimitado";

export type Plan = {
  id: PlanId;
  name: string;
  price: number; // BRL/mês
  vehicleLimit: number | null; // null = ilimitado
  userLimit: number | null; // null = ilimitado
  highlight: boolean;
  features: string[];
};

export type SubscriptionStatus = "trial" | "active" | "past_due" | "canceled";

export type Subscription = {
  status: SubscriptionStatus;
  planId: PlanId | null;
  trialEndsAt: string | null; // ISO
};
