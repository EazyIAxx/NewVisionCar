export const COMMISSION_RATE = 0.005; // 0,5% por veículo vendido

export type VendedorPerformance = {
  id: string;
  name: string;
  vehiclesSold: number;
  totalSold: number;
};

export type VendedorPerformanceWithCommission = VendedorPerformance & {
  commission: number;
};
