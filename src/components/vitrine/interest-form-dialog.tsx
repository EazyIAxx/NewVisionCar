"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MessageCircleHeart } from "lucide-react";
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
import { sendInterest } from "@/app/vitrine/actions";

const interestSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  phone: z.string().min(8, "Informe seu telefone"),
  message: z.string().optional(),
});

type InterestFormValues = z.infer<typeof interestSchema>;

export function InterestFormDialog({
  vehicleId,
  vehicleLabel,
}: {
  vehicleId: string;
  vehicleLabel: string;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InterestFormValues>({
    resolver: zodResolver(interestSchema),
  });

  async function onSubmit(values: InterestFormValues) {
    setIsSubmitting(true);
    const result = await sendInterest({ vehicleId, ...values });
    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }
    toast.success("Interesse enviado! Alguém da equipe vai te chamar em breve.");
    setIsSubmitting(false);
    setOpen(false);
    reset();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button
            size="lg"
            className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
          />
        }
      >
        <MessageCircleHeart />
        Tenho interesse
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tenho interesse</DialogTitle>
          <DialogDescription>
            Deixe seu contato que a equipe da revenda fala com você sobre o{" "}
            {vehicleLabel}.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Nome</FieldLabel>
              <Input id="name" placeholder="Seu nome" {...register("name")} />
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
            <Field>
              <FieldLabel htmlFor="message">Mensagem (opcional)</FieldLabel>
              <Input
                id="message"
                placeholder="Ex: gostaria de agendar uma visita"
                {...register("message")}
              />
            </Field>
          </FieldGroup>
          <Button
            type="submit"
            className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Enviando..." : "Enviar interesse"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
