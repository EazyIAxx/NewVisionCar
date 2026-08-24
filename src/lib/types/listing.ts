export type ListingPortal = "olx" | "webmotors";

export const listingPortalLabel: Record<ListingPortal, string> = {
  olx: "OLX",
  webmotors: "Webmotors",
};

export const listingPortals: ListingPortal[] = ["olx", "webmotors"];

export type ListingStatus = "nao_publicado" | "publicado" | "erro";

export const listingStatusLabel: Record<ListingStatus, string> = {
  nao_publicado: "Não publicado",
  publicado: "Publicado",
  erro: "Erro ao publicar",
};
