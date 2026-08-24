import type { VitrineSettings, VitrineVehicle } from "@/lib/types/vitrine";

// TODO(M12 backend): substituir por leitura real de `agencies` (slug, nome,
// cor) e `vehicles_view` (status = 'disponivel'), com RLS de leitura pública.
export const mockVitrineSettings: VitrineSettings = {
  slug: "newvisioncar-demo",
  displayName: "NewVisionCar Demo",
  accentColor: "#2596e0",
};

export const mockVitrineVehicles: VitrineVehicle[] = [
  {
    id: "1",
    brand: "Toyota",
    model: "Corolla XEi",
    year: 2023,
    km: 18000,
    price: 129900,
    color: "Prata",
    photos: [],
  },
  {
    id: "2",
    brand: "Honda",
    model: "HR-V EXL",
    year: 2022,
    km: 24000,
    price: 118900,
    color: "Branco",
    photos: [],
  },
  {
    id: "3",
    brand: "Jeep",
    model: "Compass Longitude",
    year: 2023,
    km: 12000,
    price: 168900,
    color: "Preto",
    photos: [],
  },
  {
    id: "4",
    brand: "Chevrolet",
    model: "Onix Premier",
    year: 2022,
    km: 31000,
    price: 78900,
    color: "Vermelho",
    photos: [],
  },
];
