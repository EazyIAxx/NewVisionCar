"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus, Wrench } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { formatCurrency } from "@/lib/utils";
import {
  serviceOrderTypeLabel,
  type ServiceOrder,
  type ServiceOrderType,
} from "@/lib/types/service-order";
import { ServiceOrderStatusBadge } from "@/components/estoque/service-order-status-badge";
import { createServiceOrder } from "@/app/(dashboard)/estoque/actions";

const serviceOrderSchema = z.object({
  type: z.enum(["revisao", "higienizacao", "funilaria", "mecanica", "pneus", "outros"]),
  supplier: z.string().min(1, "Informe o fornecedor"),
  amount: z.number().min(0.01, "Informe o valor"),
  date: z.string().min(1, "Informe a data"),
});

type ServiceOrderFormValues = z.infer<typeof serviceOrderSchema>;

export function ServiceOrdersPanel({ vehicleId }: { vehicleId: string }) {
  const [orders, setOrders] = useState<ServiceOrder[]>([]);
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ServiceOrderFormValues>({
    resolver: zodResolver(serviceOrderSchema),
    defaultValues: { type: "revisao" },
  });

  async function onSubmit(values: ServiceOrderFormValues) {
    setIsSubmitting(true);
    const result = await createServiceOrder({ vehicleId, ...values, status: "pendente" });
    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }
    toast.success("Ordem de serviço registrada");
    setOrders((prev) => [
      {
        id: crypto.randomUUID(),
        vehicleId,
        status: "pendente",
        ...values,
      },
      ...prev,
    ]);
    setIsSubmitting(false);
    setOpen(false);
    reset();
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="flex items-center gap-1.5">
            <Wrench className="size-4" /> Ordens de serviço
          </CardTitle>
          <CardDescription>
            Revisão, higienização, funilaria e outros serviços feitos no veículo.
          </CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger
            render={
              <Button size="sm" variant="outline" className="cursor-pointer" />
            }
          >
            <Plus />
            Nova OS
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Nova ordem de serviço</DialogTitle>
              <DialogDescription>
                Registre um serviço feito neste veículo antes da venda.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="type">Tipo de serviço</FieldLabel>
                  <select
                    id="type"
                    className="h-8 rounded-md border border-input bg-transparent px-3 text-sm dark:bg-input/30"
                    {...register("type")}
                  >
                    {(Object.keys(serviceOrderTypeLabel) as ServiceOrderType[]).map(
                      (value) => (
                        <option key={value} value={value}>
                          {serviceOrderTypeLabel[value]}
                        </option>
                      ),
                    )}
                  </select>
                </Field>
                <Field data-invalid={!!errors.supplier}>
                  <FieldLabel htmlFor="supplier">Fornecedor/oficina</FieldLabel>
                  <Input
                    id="supplier"
                    placeholder="Ex: Oficina do Zé"
                    {...register("supplier")}
                  />
                  <FieldError errors={errors.supplier ? [errors.supplier] : undefined} />
                </Field>
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
                <Field data-invalid={!!errors.date}>
                  <FieldLabel htmlFor="date">Data</FieldLabel>
                  <Input id="date" type="date" {...register("date")} />
                  <FieldError errors={errors.date ? [errors.date] : undefined} />
                </Field>
              </FieldGroup>
              <Button
                type="submit"
                className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
                disabled={isSubmitting}
              >
                {isSubmitting && <Loader2 className="animate-spin" />}
                {isSubmitting ? "Salvando..." : "Registrar OS"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </CardHeader>
      <CardContent>
        {orders.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhuma ordem de serviço registrada ainda.
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {orders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{serviceOrderTypeLabel[order.type]}</p>
                  <p className="text-sm text-muted-foreground">
                    {order.supplier} ·{" "}
                    {new Date(order.date).toLocaleDateString("pt-BR")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-medium">{formatCurrency(order.amount)}</span>
                  <ServiceOrderStatusBadge status={order.status} />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
