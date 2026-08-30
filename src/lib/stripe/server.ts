import "server-only";
import Stripe from "stripe";

// Instanciação preguiçosa: `new Stripe()` lança na hora se a chave não
// estiver presente, o que quebraria qualquer build/CI sem as chaves reais
// configuradas ainda (o Next tenta avaliar o módulo da rota do webhook na
// coleta de dados da página, mesmo sem a rota ser chamada). Só cria o client
// de verdade na primeira chamada real, em runtime.
let stripeClient: Stripe | undefined;

function getStripeClient(): Stripe {
  if (!stripeClient) {
    stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!);
  }
  return stripeClient;
}

export const stripe = new Proxy({} as Stripe, {
  get(_target, prop) {
    const client = getStripeClient();
    const value = Reflect.get(client, prop);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
