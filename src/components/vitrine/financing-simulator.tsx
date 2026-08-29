"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calculator, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { formatCurrency } from "@/lib/utils";
import { requestVitrineFinancing } from "@/app/vitrine/actions";

// Taxa ilustrativa — sem integração real com banco/financeira ainda (M15).
const MONTHLY_RATE = 0.015;
const TERMS = [12, 24, 36, 48, 60];

const requestSchema = z.object({
  name: z.string().min(2, "Informe seu nome"),
  phone: z.string().min(8, "Informe seu telefone"),
  email: z.string().email("E-mail inválido").optional().or(z.literal("")),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export function FinancingSimulator({
  slug,
  vehicleId,
  price,
}: {
  slug: string;
  vehicleId: string;
  price: number;
}) {
  const [open, setOpen] = useState(false);
  const [downPayment, setDownPayment] = useState(String(Math.round(price * 0.2)));
  const [term, setTerm] = useState(48);
  const [requested, setRequested] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RequestFormValues>({ resolver: zodResolver(requestSchema) });

  const financedAmount = Math.max(price - Number(downPayment || 0), 0);
  const installment =
    financedAmount > 0
      ? (financedAmount * MONTHLY_RATE) / (1 - Math.pow(1 + MONTHLY_RATE, -term))
      : 0;

  async function onSubmit(values: RequestFormValues) {
    setIsSubmitting(true);
    const result = await requestVitrineFinancing({
      slug,
      vehicleId,
      ...values,
      downPayment: Number(downPayment || 0),
      termMonths: term,
      installmentEstimate: installment,
    });
    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }
    toast.success("Solicitação enviada! Alguém da equipe vai te chamar em breve.");
    setIsSubmitting(false);
    setRequested(true);
  }

  if (!open) {
    return (
      <Button
        variant="outline"
        className="w-full cursor-pointer"
        onClick={() => setOpen(true)}
      >
        <Calculator />
        Simular financiamento
      </Button>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-900 p-5">
      <h2 className="font-semibold text-slate-900">Simular financiamento</h2>
      <p className="mt-1 text-xs text-slate-500">
        Simulação ilustrativa. Condições reais dependem de análise de crédito.
      </p>

      <div className="mt-4 flex flex-col gap-3">
        <div>
          <label htmlFor="down-payment" className="text-xs text-slate-500">
            Valor de entrada
          </label>
          <Input
            id="down-payment"
            type="number"
            value={downPayment}
            onChange={(e) => setDownPayment(e.target.value)}
            className="mt-1"
          />
        </div>

        <div>
          <label htmlFor="term" className="text-xs text-slate-500">
            Prazo
          </label>
          <select
            id="term"
            value={term}
            onChange={(e) => setTerm(Number(e.target.value))}
            className="mt-1 h-8 w-full rounded-md border border-input bg-transparent px-3 text-sm outline-none focus:border-[#2596e0]"
          >
            {TERMS.map((t) => (
              <option key={t} value={t}>
                {t}x
              </option>
            ))}
          </select>
        </div>

        <div className="rounded-xl bg-slate-50 p-4 text-center">
          <p className="text-xs text-slate-500">Parcela estimada</p>
          <p className="bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] bg-clip-text text-2xl font-bold text-transparent">
            {formatCurrency(installment)}/mês
          </p>
        </div>

        {requested ? (
          <p className="rounded-md bg-slate-50 p-3 text-center text-sm text-slate-600">
            Solicitação enviada! Alguém da equipe vai te chamar em breve.
          </p>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3">
            <FieldGroup>
              <Field data-invalid={!!errors.name}>
                <FieldLabel htmlFor="financing-name">Nome</FieldLabel>
                <Input id="financing-name" placeholder="Seu nome" {...register("name")} />
                <FieldError errors={errors.name ? [errors.name] : undefined} />
              </Field>
              <Field data-invalid={!!errors.phone}>
                <FieldLabel htmlFor="financing-phone">Telefone</FieldLabel>
                <Input
                  id="financing-phone"
                  placeholder="(11) 99999-0000"
                  {...register("phone")}
                />
                <FieldError errors={errors.phone ? [errors.phone] : undefined} />
              </Field>
              <Field data-invalid={!!errors.email}>
                <FieldLabel htmlFor="financing-email">E-mail (opcional)</FieldLabel>
                <Input id="financing-email" type="email" {...register("email")} />
                <FieldError errors={errors.email ? [errors.email] : undefined} />
              </Field>
            </FieldGroup>
            <Button
              type="submit"
              className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
              disabled={isSubmitting}
            >
              {isSubmitting && <Loader2 className="animate-spin" />}
              {isSubmitting ? "Enviando..." : "Solicitar financiamento"}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
