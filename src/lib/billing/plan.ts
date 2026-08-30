// Conteúdo de marketing do plano único — não vem do Stripe (a página de
// preços é estática, não faz uma chamada à API do Stripe só pra exibir o
// valor). Ajuste `price` aqui se o valor do Price ID no Stripe mudar.
export const PLAN = {
  name: "NewVisionCar",
  price: 299,
  features: [
    "Veículos e usuários ilimitados",
    "Estoque, CRM, Vendas e Clientes",
    "Financeiro e Desempenho",
    "Vitrine pública da revenda",
    "Suporte prioritário",
  ],
};
