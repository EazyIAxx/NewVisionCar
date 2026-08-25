import type { RenaveTransfer } from "@/lib/types/renave";

// TODO(M14 backend): substituir por tabela `renave_transfers` real, vinculada
// a `sales`, com o retorno assíncrono da API do RENAVE/DETRAN.
export const mockRenaveTransfers: RenaveTransfer[] = [
  {
    id: "renave-1",
    saleId: "1",
    status: "concluida",
    buyerDocument: "123.456.789-00",
    buyerRg: "12.345.678-9",
    buyerAddress: "Rua das Flores, 123 — São Paulo/SP",
    protocol: "RNV-2026-00981",
    updatedAt: "2026-09-25T10:00:00Z",
  },
  {
    id: "renave-3",
    saleId: "3",
    status: "erro",
    buyerDocument: "987.654.321-00",
    buyerRg: "98.765.432-1",
    buyerAddress: "Av. Central, 456 — São Paulo/SP",
    protocol: "RNV-2026-01044",
    updatedAt: "2026-10-07T09:00:00Z",
  },
];

export function getRenaveTransferForSale(saleId: string): RenaveTransfer | null {
  return mockRenaveTransfers.find((transfer) => transfer.saleId === saleId) ?? null;
}
