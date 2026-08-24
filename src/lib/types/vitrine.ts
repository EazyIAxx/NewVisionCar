export type VitrineSettings = {
  slug: string;
  displayName: string;
  accentColor: string;
};

export type VitrineVehicle = {
  id: string;
  brand: string;
  model: string;
  year: number;
  km: number;
  price: number;
  color: string;
  photos: string[];
};

export type InterestFormInput = {
  vehicleId: string;
  name: string;
  phone: string;
  message?: string;
};
