"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Send } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { sendInterest } from "@/app/vitrine/actions";

const proposalSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
  phone: z.string().min(8, "Informe seu telefone"),
  message: z.string().optional(),
});

type ProposalFormValues = z.infer<typeof proposalSchema>;

export function ProposalPanel({ vehicleId }: { vehicleId: string }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ProposalFormValues>({
    resolver: zodResolver(proposalSchema),
  });

  async function onSubmit(values: ProposalFormValues) {
    setIsSubmitting(true);
    const result = await sendInterest({ vehicleId, ...values });
    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }
    toast.success("Proposta enviada! Alguém da equipe vai te chamar em breve.");
    setIsSubmitting(false);
    reset();
  }

  return (
    <div className="rounded-2xl border border-slate-900 p-5">
      <h2 className="font-semibold text-slate-900">Envie sua proposta</h2>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mt-4 flex flex-col gap-3"
      >
        <FieldGroup>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="proposal-name">Nome</FieldLabel>
            <Input id="proposal-name" placeholder="Seu nome" {...register("name")} />
            <FieldError errors={errors.name ? [errors.name] : undefined} />
          </Field>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="proposal-email">E-mail</FieldLabel>
            <Input
              id="proposal-email"
              type="email"
              placeholder="voce@email.com"
              {...register("email")}
            />
            <FieldError errors={errors.email ? [errors.email] : undefined} />
          </Field>
          <Field data-invalid={!!errors.phone}>
            <FieldLabel htmlFor="proposal-phone">Telefone</FieldLabel>
            <Input
              id="proposal-phone"
              placeholder="(11) 99999-0000"
              {...register("phone")}
            />
            <FieldError errors={errors.phone ? [errors.phone] : undefined} />
          </Field>
          <Field>
            <FieldLabel htmlFor="proposal-message">Mensagem</FieldLabel>
            <textarea
              id="proposal-message"
              rows={3}
              placeholder="Ex: tenho interesse, aceita meu usado na troca?"
              className="rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:border-[#2596e0]"
              {...register("message")}
            />
          </Field>
        </FieldGroup>
        <Button
          type="submit"
          className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
          disabled={isSubmitting}
        >
          {isSubmitting ? <Loader2 className="animate-spin" /> : <Send />}
          {isSubmitting ? "Enviando..." : "Enviar proposta"}
        </Button>
      </form>
    </div>
  );
}
