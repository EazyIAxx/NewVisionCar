import type { PaymentMethod } from "./sale";

export type CommissionRates = Record<PaymentMethod, number>;

export type VendedorPerformance = {
  id: string;
  name: string;
  vehiclesSold: number;
  totalSold: number;
};

export type VendedorPerformanceWithCommission = VendedorPerformance & {
  commission: number;
};
