import type { PlanTier } from "@/lib/types/billing";

// Conteúdo de marketing dos planos — não vem do Stripe (a página de preços é
// estática, não faz uma chamada à API do Stripe só pra exibir o valor).
// Ajuste `price` aqui se o valor no Stripe mudar.
export type PlanInfo = {
  tier: PlanTier;
  name: string;
  price: number;
  highlight: boolean;
  features: string[];
};

export const PLANS: PlanInfo[] = [
  {
    tier: "basico",
    name: "Básico",
    price: 129.9,
    highlight: false,
    features: [
      "Veículos e usuários ilimitados",
      "Estoque, CRM, Vendas e Clientes",
      "Financeiro e Desempenho",
      "Vitrine pública da revenda",
    ],
  },
  {
    tier: "com_ia",
    name: "Com IA no WhatsApp",
    price: 299.9,
    highlight: true,
    features: [
      "Tudo do plano Básico",
      "Agente de IA no WhatsApp",
      "Suporte prioritário",
    ],
  },
];
