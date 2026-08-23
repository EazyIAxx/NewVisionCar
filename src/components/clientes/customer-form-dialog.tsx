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
import { createCustomer } from "@/app/(dashboard)/clientes/actions";

// TODO(backend): substituir por lista real de vendedores da agência (profiles).
const mockVendedores = ["Ana Souza", "Carlos Lima", "Bianca Alves"];

const customerSchema = z.object({
  name: z.string().min(2, "Informe o nome"),
  phone: z.string().min(8, "Informe o telefone"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  vendedorName: z.string().min(1, "Selecione o vendedor"),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export function CustomerFormDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
    defaultValues: { vendedorName: mockVendedores[0] },
  });

  async function onSubmit(values: CustomerFormValues) {
    setIsSubmitting(true);
    const result = await createCustomer(values);
    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }
    toast.success("Cliente cadastrado");
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
        Adicionar cliente
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar cliente</DialogTitle>
          <DialogDescription>
            Cadastro avulso, sem vínculo com um lead ou venda existente.
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
              <FieldLabel htmlFor="vendedorName">Vendedor responsável</FieldLabel>
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
            {isSubmitting ? "Salvando..." : "Adicionar cliente"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
