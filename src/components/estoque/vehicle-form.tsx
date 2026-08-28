"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ImagePlus, Loader2, X } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import type { Role } from "@/components/layout/nav-config";
import type { Vehicle, VehicleStatus } from "@/lib/types/vehicle";
import { vehicleStatusLabel } from "@/lib/types/vehicle";
import {
  fuelTypeLabel,
  transmissionLabel,
  type FuelType,
  type Transmission,
} from "@/lib/types/vitrine";

const vehicleSchema = z.object({
  brand: z.string().min(1, "Informe a marca"),
  model: z.string().min(1, "Informe o modelo"),
  year: z.number().min(1990).max(new Date().getFullYear() + 1),
  plate: z.string().min(1, "Informe a placa"),
  color: z.string().min(1, "Informe a cor"),
  km: z.number().min(0),
  price: z.number().min(0, "Informe o preço de venda"),
  costPrice: z.number().min(0).optional(),
  transmission: z.enum(["manual", "automatico", ""]).optional(),
  fuelType: z.enum(["flex", "gasolina", "diesel", "hibrido", "eletrico", ""]).optional(),
  description: z.string().optional(),
  features: z.string().optional(),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

export type VehicleFormResult = { error: string | null };

type PhotoItem =
  | { type: "existing"; url: string }
  | { type: "new"; file: File; previewUrl: string };

export function VehicleForm({
  role,
  mode,
  initialValues,
  onSubmit,
}: {
  role: Role;
  mode: "create" | "edit";
  initialValues?: Vehicle;
  onSubmit: (formData: FormData) => Promise<VehicleFormResult>;
}) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<VehicleStatus>(
    initialValues?.status ?? "disponivel",
  );
  const [photos, setPhotos] = useState<PhotoItem[]>(
    (initialValues?.photos ?? []).map((url) => ({ type: "existing", url })),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: initialValues
      ? {
          brand: initialValues.brand,
          model: initialValues.model,
          year: initialValues.year,
          plate: initialValues.plate,
          color: initialValues.color,
          km: initialValues.km,
          price: initialValues.price,
          costPrice: initialValues.costPrice ?? undefined,
          transmission: initialValues.transmission ?? "",
          fuelType: initialValues.fuelType ?? "",
          description: initialValues.description ?? "",
          features: initialValues.features.join(", "),
        }
      : undefined,
  });

  function handlePhotoChange(event: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(event.target.files ?? []);
    const newItems: PhotoItem[] = files.map((file) => ({
      type: "new",
      file,
      previewUrl: URL.createObjectURL(file),
    }));
    setPhotos((prev) => [...prev, ...newItems]);
    event.target.value = "";
  }

  function removePhoto(index: number) {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  }

  async function onValid(values: VehicleFormValues) {
    setIsSubmitting(true);

    const formData = new FormData();
    formData.set("brand", values.brand);
    formData.set("model", values.model);
    formData.set("year", String(values.year));
    formData.set("plate", values.plate);
    formData.set("color", values.color);
    formData.set("km", String(values.km));
    formData.set("price", String(values.price));
    if (values.costPrice !== undefined) {
      formData.set("costPrice", String(values.costPrice));
    }
    formData.set("status", status);
    if (values.transmission) formData.set("transmission", values.transmission);
    if (values.fuelType) formData.set("fuelType", values.fuelType);
    if (values.description) formData.set("description", values.description);
    if (values.features) formData.set("features", values.features);
    formData.set(
      "existingPhotos",
      JSON.stringify(
        photos
          .filter((p): p is Extract<PhotoItem, { type: "existing" }> => p.type === "existing")
          .map((p) => p.url),
      ),
    );
    photos
      .filter((p): p is Extract<PhotoItem, { type: "new" }> => p.type === "new")
      .forEach((p) => formData.append("newFiles", p.file));

    const result = await onSubmit(formData);
    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }
    toast.success(
      mode === "create" ? "Veículo cadastrado" : "Veículo atualizado",
    );
    router.push("/estoque");
    router.refresh();
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(onValid)} className="flex flex-col gap-6">
          <div>
            <p className="mb-2 text-sm font-medium">Fotos</p>
            <div className="flex flex-wrap gap-3">
              {photos.map((photo, index) => (
                // eslint-disable-next-line @next/next/no-img-element
                <div
                  key={photo.type === "existing" ? photo.url : photo.previewUrl}
                  className="relative size-24 overflow-hidden rounded-md border"
                >
                  <img
                    src={photo.type === "existing" ? photo.url : photo.previewUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removePhoto(index)}
                    className="absolute right-1 top-1 cursor-pointer rounded-full bg-black/60 p-0.5 text-white"
                    aria-label="Remover foto"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              ))}
              <label className="flex size-24 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border border-dashed text-muted-foreground hover:border-primary hover:text-primary">
                <ImagePlus className="size-5" />
                <span className="text-xs">Adicionar</span>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handlePhotoChange}
                />
              </label>
            </div>
          </div>

          <FieldGroup className="grid gap-4 sm:grid-cols-2">
            <Field data-invalid={!!errors.brand}>
              <FieldLabel htmlFor="brand">Marca</FieldLabel>
              <Input id="brand" placeholder="Toyota" {...register("brand")} />
              <FieldError errors={errors.brand ? [errors.brand] : undefined} />
            </Field>
            <Field data-invalid={!!errors.model}>
              <FieldLabel htmlFor="model">Modelo</FieldLabel>
              <Input id="model" placeholder="Corolla XEi" {...register("model")} />
              <FieldError errors={errors.model ? [errors.model] : undefined} />
            </Field>
            <Field data-invalid={!!errors.year}>
              <FieldLabel htmlFor="year">Ano</FieldLabel>
              <Input
                id="year"
                type="number"
                {...register("year", { valueAsNumber: true })}
              />
              <FieldError errors={errors.year ? [errors.year] : undefined} />
            </Field>
            <Field data-invalid={!!errors.plate}>
              <FieldLabel htmlFor="plate">Placa</FieldLabel>
              <Input id="plate" placeholder="ABC1D23" {...register("plate")} />
              <FieldError errors={errors.plate ? [errors.plate] : undefined} />
            </Field>
            <Field data-invalid={!!errors.color}>
              <FieldLabel htmlFor="color">Cor</FieldLabel>
              <Input id="color" placeholder="Prata" {...register("color")} />
              <FieldError errors={errors.color ? [errors.color] : undefined} />
            </Field>
            <Field data-invalid={!!errors.km}>
              <FieldLabel htmlFor="km">Quilometragem</FieldLabel>
              <Input
                id="km"
                type="number"
                {...register("km", { valueAsNumber: true })}
              />
              <FieldError errors={errors.km ? [errors.km] : undefined} />
            </Field>
            <Field data-invalid={!!errors.price}>
              <FieldLabel htmlFor="price">Preço de venda</FieldLabel>
              <Input
                id="price"
                type="number"
                {...register("price", { valueAsNumber: true })}
              />
              <FieldError errors={errors.price ? [errors.price] : undefined} />
            </Field>
            {role === "gestor" && (
              <Field data-invalid={!!errors.costPrice}>
                <FieldLabel htmlFor="costPrice">Custo (só você vê)</FieldLabel>
                <Input
                  id="costPrice"
                  type="number"
                  {...register("costPrice", { valueAsNumber: true })}
                />
                <FieldError
                  errors={errors.costPrice ? [errors.costPrice] : undefined}
                />
              </Field>
            )}
            <Field>
              <FieldLabel htmlFor="transmission">Câmbio</FieldLabel>
              <select
                id="transmission"
                className="h-8 rounded-md border border-input bg-transparent px-3 text-sm dark:bg-input/30"
                {...register("transmission")}
              >
                <option value="">Não informado</option>
                {(Object.keys(transmissionLabel) as Transmission[]).map((value) => (
                  <option key={value} value={value}>
                    {transmissionLabel[value]}
                  </option>
                ))}
              </select>
            </Field>
            <Field>
              <FieldLabel htmlFor="fuelType">Combustível</FieldLabel>
              <select
                id="fuelType"
                className="h-8 rounded-md border border-input bg-transparent px-3 text-sm dark:bg-input/30"
                {...register("fuelType")}
              >
                <option value="">Não informado</option>
                {(Object.keys(fuelTypeLabel) as FuelType[]).map((value) => (
                  <option key={value} value={value}>
                    {fuelTypeLabel[value]}
                  </option>
                ))}
              </select>
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="features">
                Opcionais (separados por vírgula)
              </FieldLabel>
              <Input
                id="features"
                placeholder="Ar condicionado, Central multimídia, Câmera de ré"
                {...register("features")}
              />
            </Field>
            <Field className="sm:col-span-2">
              <FieldLabel htmlFor="description">
                Descrição (exibida na vitrine pública)
              </FieldLabel>
              <textarea
                id="description"
                rows={3}
                className="rounded-md border border-input bg-transparent px-3 py-2 text-sm dark:bg-input/30"
                {...register("description")}
              />
            </Field>
            {mode === "edit" && (
              <Field>
                <FieldLabel htmlFor="status">Status</FieldLabel>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value as VehicleStatus)}
                  className="h-8 rounded-md border border-input bg-transparent px-3 text-sm dark:bg-input/30"
                >
                  {Object.entries(vehicleStatusLabel).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </Field>
            )}
          </FieldGroup>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="cursor-pointer"
              onClick={() => router.push("/estoque")}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="animate-spin" />}
              {mode === "create" ? "Cadastrar veículo" : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
