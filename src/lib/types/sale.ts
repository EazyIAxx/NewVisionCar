export type PaymentMethod = "a_vista" | "financiado" | "cartao" | "consorcio";

export const paymentMethodLabel: Record<PaymentMethod, string> = {
  a_vista: "À vista",
  financiado: "Financiado",
  cartao: "Cartão",
  consorcio: "Consórcio",
};

export type Sale = {
  id: string;
  customerName: string;
  vehicleBrand: string;
  vehicleModel: string;
  // Custo do veículo — null quando o usuário logado é vendedor (a
  // `sales_view` esconde a coluna via RLS de coluna, mesmo padrão do
  // vehicles_view). Só é usado para calcular o lucro líquido no Financeiro.
  costPrice: number | null;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string; // ISO
  vendedorId: string;
  vendedorName: string;
};
