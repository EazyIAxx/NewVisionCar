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

const vehicleSchema = z.object({
  brand: z.string().min(1, "Informe a marca"),
  model: z.string().min(1, "Informe o modelo"),
  year: z.number().min(1990).max(new Date().getFullYear() + 1),
  plate: z.string().min(1, "Informe a placa"),
  color: z.string().min(1, "Informe a cor"),
  km: z.number().min(0),
  price: z.number().min(0, "Informe o preço de venda"),
  costPrice: z.number().min(0).optional(),
});

type VehicleFormValues = z.infer<typeof vehicleSchema>;

export type VehicleFormResult = { error: string | null };

export type VehicleFormSubmitPayload = {
  values: VehicleFormValues & { status: VehicleStatus };
  existingPhotos: string[];
  newFiles: File[];
};

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
  onSubmit: (payload: VehicleFormSubmitPayload) => Promise<VehicleFormResult>;
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
    const result = await onSubmit({
      values: { ...values, status },
      existingPhotos: photos
        .filter((p): p is Extract<PhotoItem, { type: "existing" }> => p.type === "existing")
        .map((p) => p.url),
      newFiles: photos
        .filter((p): p is Extract<PhotoItem, { type: "new" }> => p.type === "new")
        .map((p) => p.file),
    });
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
            <Button type="submit" className="flex-1 cursor-pointer" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="animate-spin" />}
              {mode === "create" ? "Cadastrar veículo" : "Salvar alterações"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
