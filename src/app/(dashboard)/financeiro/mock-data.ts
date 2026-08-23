import type { Expense, MonthlyFinance, Sale } from "@/lib/types/finance";

// TODO(M3 backend): remover e substituir por query real nas tabelas `expenses` e vendas de veículos.
export const mockExpenses: Expense[] = [
  {
    id: "1",
    category: "aluguel",
    description: "Aluguel do showroom — outubro",
    amount: 8500,
    date: "2026-10-05",
  },
  {
    id: "2",
    category: "funcionarios",
    description: "Folha de pagamento — outubro",
    amount: 22000,
    date: "2026-10-05",
  },
  {
    id: "3",
    category: "marketing",
    description: "Anúncios OLX + Instagram",
    amount: 3200,
    date: "2026-10-12",
  },
  {
    id: "4",
    category: "manutencao",
    description: "Revisão do Compass antes da venda",
    amount: 1450,
    date: "2026-10-18",
  },
  {
    id: "5",
    category: "marketing",
    description: "Impulsionamento Webmotors",
    amount: 1800,
    date: "2026-09-20",
  },
  {
    id: "6",
    category: "aluguel",
    description: "Aluguel do showroom — setembro",
    amount: 8500,
    date: "2026-09-05",
  },
];

// TODO(M3 backend): substituir por veículos reais com status "vendido" (tabela `vehicles`).
export const mockSales: Sale[] = [
  {
    id: "1",
    vehicleBrand: "Chevrolet",
    vehicleModel: "Onix Premier",
    vendedorName: "Ana Souza",
    saleDate: "2026-10-14",
    salePrice: 78900,
    costPrice: 64000,
  },
  {
    id: "2",
    vehicleBrand: "Jeep",
    vehicleModel: "Compass Longitude",
    vendedorName: "Carlos Lima",
    saleDate: "2026-10-08",
    salePrice: 168900,
    costPrice: 142000,
  },
  {
    id: "3",
    vehicleBrand: "Honda",
    vehicleModel: "HR-V EXL",
    vendedorName: "Ana Souza",
    saleDate: "2026-09-22",
    salePrice: 119900,
    costPrice: 99500,
  },
];

// TODO(M3 backend): calcular a partir de vendas + despesas reais por período.
export const mockMonthlyFinance: MonthlyFinance[] = [
  { month: "Mai", revenue: 145000, expenses: 32000, profit: 113000 },
  { month: "Jun", revenue: 168000, expenses: 35500, profit: 132500 },
  { month: "Jul", revenue: 121000, expenses: 30800, profit: 90200 },
  { month: "Ago", revenue: 189000, expenses: 38200, profit: 150800 },
  { month: "Set", revenue: 119900, expenses: 33500, profit: 86400 },
  { month: "Out", revenue: 247800, expenses: 36950, profit: 210850 },
];
