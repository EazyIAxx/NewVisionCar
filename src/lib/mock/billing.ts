import type { Plan, Subscription } from "@/lib/types/billing";

// TODO(M7 backend): substituir por planos/preços reais do Stripe (Price IDs)
// e status vindo de `agencies.plan_status`/`agencies.stripe_customer_id`.
export const mockPlans: Plan[] = [
  {
    id: "start",
    name: "Start",
    price: 149,
    vehicleLimit: 15,
    userLimit: 2,
    highlight: false,
    features: [
      "Até 15 veículos em estoque",
      "Até 2 usuários (Gestor + 1 Vendedor)",
      "Estoque, CRM, Vendas e Clientes",
      "Financeiro e Desempenho",
    ],
  },
  {
    id: "profissional",
    name: "Profissional",
    price: 299,
    vehicleLimit: 50,
    userLimit: 6,
    highlight: true,
    features: [
      "Até 50 veículos em estoque",
      "Até 6 usuários",
      "Tudo do plano Start",
      "Suporte prioritário",
    ],
  },
  {
    id: "ilimitado",
    name: "Ilimitado",
    price: 549,
    vehicleLimit: null,
    userLimit: null,
    highlight: false,
    features: [
      "Veículos em estoque ilimitados",
      "Usuários ilimitados",
      "Tudo do plano Profissional",
      "Acesso antecipado a novos módulos",
    ],
  },
];

// TODO(M7 backend): substituir por leitura real de `agencies.plan_status`.
export const mockSubscription: Subscription = {
  status: "trial",
  planId: null,
  trialEndsAt: "2026-09-06T00:00:00Z",
};
