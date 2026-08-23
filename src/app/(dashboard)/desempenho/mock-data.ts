import type { VendedorPerformance } from "@/lib/types/performance";

// TODO(M5 backend): remover e substituir por agregação real de vendas (M2) + atribuição de fechamento (M4).
export const mockPerformance: VendedorPerformance[] = [
  { id: "1", name: "Ana Souza", vehiclesSold: 5, totalSold: 620000 },
  { id: "2", name: "Carlos Lima", vehiclesSold: 4, totalSold: 512000 },
  { id: "3", name: "Bianca Alves", vehiclesSold: 3, totalSold: 398000 },
];
