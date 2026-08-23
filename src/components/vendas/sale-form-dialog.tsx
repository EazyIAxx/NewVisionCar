"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { paymentMethodLabel, type PaymentMethod } from "@/lib/types/sale";
import { createSale } from "@/app/(dashboard)/vendas/actions";

// TODO(backend): substituir por lista real de vendedores da agência (profiles).
const mockVendedores = ["Ana Souza", "Carlos Lima", "Bianca Alves"];

const saleSchema = z.object({
  customerName: z.string().min(2, "Informe o cliente"),
  vehicleBrand: z.string().min(1, "Informe a marca"),
  vehicleModel: z.string().min(1, "Informe o modelo"),
  amount: z.number().min(0.01, "Informe o valor"),
  paymentMethod: z.enum(["a_vista", "financiado", "cartao", "consorcio"]),
  date: z.string().min(1, "Informe a data"),
  vendedorName: z.string().min(1, "Selecione o vendedor"),
});

type SaleFormValues = z.infer<typeof saleSchema>;

export function SaleFormDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SaleFormValues>({
    resolver: zodResolver(saleSchema),
    defaultValues: { paymentMethod: "a_vista", vendedorName: mockVendedores[0] },
  });

  async function onSubmit(values: SaleFormValues) {
    setIsSubmitting(true);
    const result = await createSale(values);
    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }
    toast.success("Venda registrada");
    setIsSubmitting(false);
    setOpen(false);
    reset();
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110" />
        }
      >
        <Plus />
        Registrar venda
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Registrar venda</DialogTitle>
          <DialogDescription>
            Cliente, veículo, valor e forma de pagamento.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={!!errors.customerName}>
              <FieldLabel htmlFor="customerName">Cliente</FieldLabel>
              <Input
                id="customerName"
                placeholder="Nome do cliente"
                {...register("customerName")}
              />
              <FieldError
                errors={errors.customerName ? [errors.customerName] : undefined}
              />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field data-invalid={!!errors.vehicleBrand}>
                <FieldLabel htmlFor="vehicleBrand">Marca</FieldLabel>
                <Input
                  id="vehicleBrand"
                  placeholder="Toyota"
                  {...register("vehicleBrand")}
                />
                <FieldError
                  errors={errors.vehicleBrand ? [errors.vehicleBrand] : undefined}
                />
              </Field>
              <Field data-invalid={!!errors.vehicleModel}>
                <FieldLabel htmlFor="vehicleModel">Modelo</FieldLabel>
                <Input
                  id="vehicleModel"
                  placeholder="Corolla XEi"
                  {...register("vehicleModel")}
                />
                <FieldError
                  errors={errors.vehicleModel ? [errors.vehicleModel] : undefined}
                />
              </Field>
            </div>
            <Field data-invalid={!!errors.amount}>
              <FieldLabel htmlFor="amount">Valor</FieldLabel>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register("amount", { valueAsNumber: true })}
              />
              <FieldError errors={errors.amount ? [errors.amount] : undefined} />
            </Field>
            <Field>
              <FieldLabel htmlFor="paymentMethod">Forma de pagamento</FieldLabel>
              <select
                id="paymentMethod"
                className="h-8 rounded-md border border-input bg-transparent px-3 text-sm dark:bg-input/30"
                {...register("paymentMethod")}
              >
                {(Object.keys(paymentMethodLabel) as PaymentMethod[]).map(
                  (value) => (
                    <option key={value} value={value}>
                      {paymentMethodLabel[value]}
                    </option>
                  ),
                )}
              </select>
            </Field>
            <Field data-invalid={!!errors.date}>
              <FieldLabel htmlFor="date">Data</FieldLabel>
              <Input id="date" type="date" {...register("date")} />
              <FieldError errors={errors.date ? [errors.date] : undefined} />
            </Field>
            <Field>
              <FieldLabel htmlFor="vendedorName">Vendedor</FieldLabel>
              <select
                id="vendedorName"
                className="h-8 rounded-md border border-input bg-transparent px-3 text-sm dark:bg-input/30"
                {...register("vendedorName")}
              >
                {mockVendedores.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </Field>
          </FieldGroup>
          <Button
            type="submit"
            className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Salvando..." : "Registrar venda"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
