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
  // Custo do veículo — não aparece no formulário de "Registrar venda" (quem
  // registra a venda não vê/edita o custo), só é usado para calcular o lucro
  // líquido no módulo Financeiro.
  costPrice: number;
  amount: number;
  paymentMethod: PaymentMethod;
  date: string; // ISO
  vendedorName: string;
};
