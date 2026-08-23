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
import { leadOriginLabel, type LeadOrigin } from "@/lib/types/lead";
import { createLead } from "@/app/(dashboard)/crm/actions";

const leadSchema = z.object({
  name: z.string().min(2, "Informe o nome"),
  phone: z.string().min(8, "Informe o telefone"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  origin: z.enum(["whatsapp", "site", "indicacao"]),
  vehicleInterest: z.string().optional(),
});

type LeadFormValues = z.infer<typeof leadSchema>;

export function NewLeadDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LeadFormValues>({
    resolver: zodResolver(leadSchema),
    defaultValues: { origin: "whatsapp" },
  });

  async function onSubmit(values: LeadFormValues) {
    setIsSubmitting(true);
    const result = await createLead(values);
    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }
    toast.success("Lead cadastrado");
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
        Novo lead
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Novo lead</DialogTitle>
          <DialogDescription>
            Cadastre manualmente um contato interessado.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input id="name" placeholder="Nome do cliente" {...register("name")} />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>
            <Field data-invalid={!!errors.phone}>
              <FieldLabel htmlFor="phone">Telefone</FieldLabel>
              <Input
                id="phone"
                placeholder="(11) 99999-0000"
                {...register("phone")}
              />
              <FieldError errors={errors.phone ? [errors.phone] : undefined} />
            </Field>
            <Field data-invalid={!!errors.email}>
              <FieldLabel htmlFor="email">E-mail (opcional)</FieldLabel>
              <Input id="email" type="email" {...register("email")} />
              <FieldError errors={errors.email ? [errors.email] : undefined} />
            </Field>
            <Field>
              <FieldLabel htmlFor="origin">Origem</FieldLabel>
              <select
                id="origin"
                className="h-8 rounded-md border border-input bg-transparent px-3 text-sm dark:bg-input/30"
                {...register("origin")}
              >
                {(Object.keys(leadOriginLabel) as LeadOrigin[]).map((value) => (
                  <option key={value} value={value}>
                    {leadOriginLabel[value]}
                  </option>
                ))}
              </select>
            </Field>
            <Field>
              <FieldLabel htmlFor="vehicleInterest">
                Veículo de interesse (opcional)
              </FieldLabel>
              <Input
                id="vehicleInterest"
                placeholder="Ex: Toyota Corolla XEi"
                {...register("vehicleInterest")}
              />
            </Field>
          </FieldGroup>
          <Button
            type="submit"
            className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Salvando..." : "Cadastrar lead"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
