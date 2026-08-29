"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Calculator, Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { formatCurrency } from "@/lib/utils";
import {
  financingRequestStatusLabel,
  type FinancingRequest,
  type FinancingRequestStatus,
} from "@/lib/types/financing";
import { requestFinancing, updateFinancingRequestStatus } from "@/app/(dashboard)/estoque/actions";

// Taxa ilustrativa — sem integração real com banco/financeira ainda (Fase D).
const MONTHLY_RATE = 0.015;
const TERMS = [12, 24, 36, 48, 60];

const statusClassName: Record<FinancingRequestStatus, string> = {
  pendente: "bg-status-reserved/15 text-status-reserved",
  aprovado: "bg-status-available/15 text-status-available",
  recusado: "bg-status-lost/15 text-status-lost",
};

const requestSchema = z.object({
  customerName: z.string().min(2, "Informe o nome"),
  customerPhone: z.string().min(8, "Informe o telefone"),
  customerEmail: z.string().email("E-mail inválido").optional().or(z.literal("")),
});

type RequestFormValues = z.infer<typeof requestSchema>;

export function FinancingSimulatorPanel({
  vehicleId,
  price,
  initialRequests,
  isGestor,
}: {
  vehicleId: string;
  price: number;
  initialRequests: FinancingRequest[];
  isGestor: boolean;
}) {
  const [downPayment, setDownPayment] = useState(String(Math.round(price * 0.2)));
  const [term, setTerm] = useState(48);
  const [requests, setRequests] = useState(initialRequests);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [decidingId, setDecidingId] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RequestFormValues>({ resolver: zodResolver(requestSchema) });

  const financedAmount = Math.max(price - Number(downPayment || 0), 0);
  const installment =
    financedAmount > 0
      ? (financedAmount * MONTHLY_RATE) / (1 - Math.pow(1 + MONTHLY_RATE, -term))
      : 0;

  async function onSubmit(values: RequestFormValues) {
    setIsSubmitting(true);
    const result = await requestFinancing({
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
    toast.success("Financiamento solicitado");
    setRequests((prev) => [
      {
        id: crypto.randomUUID(),
        vehicleId,
        leadId: null,
        status: "pendente",
        customerName: values.customerName,
        customerPhone: values.customerPhone,
        customerEmail: values.customerEmail || null,
        downPayment: Number(downPayment || 0),
        termMonths: term,
        installmentEstimate: installment,
        createdAt: new Date().toISOString(),
      },
      ...prev,
    ]);
    setIsSubmitting(false);
    reset();
  }

  async function handleDecide(requestId: string, status: "aprovado" | "recusado") {
    setDecidingId(requestId);
    const result = await updateFinancingRequestStatus(requestId, status);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(status === "aprovado" ? "Financiamento aprovado" : "Financiamento recusado");
      setRequests((prev) =>
        prev.map((r) => (r.id === requestId ? { ...r, status } : r)),
      );
    }
    setDecidingId(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Calculator className="size-4" /> Financiamento
        </CardTitle>
        <CardDescription>
          Simulação ilustrativa pra apoiar a negociação. Condições reais
          dependem de análise de crédito.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <Field>
            <FieldLabel htmlFor="sim-down-payment">Valor de entrada</FieldLabel>
            <Input
              id="sim-down-payment"
              type="number"
              value={downPayment}
              onChange={(e) => setDownPayment(e.target.value)}
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="sim-term">Prazo</FieldLabel>
            <select
              id="sim-term"
              value={term}
              onChange={(e) => setTerm(Number(e.target.value))}
              className="h-8 rounded-md border border-input bg-transparent px-3 text-sm dark:bg-input/30"
            >
              {TERMS.map((t) => (
                <option key={t} value={t}>
                  {t}x
                </option>
              ))}
            </select>
          </Field>
          <div className="flex flex-col justify-center rounded-lg bg-muted/50 p-3 text-center">
            <p className="text-xs text-muted-foreground">Parcela estimada</p>
            <p className="text-xl font-bold text-status-available">
              {formatCurrency(installment)}/mês
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 border-t pt-4">
          <p className="text-sm font-medium">Solicitar financiamento pro cliente</p>
          <FieldGroup className="grid gap-4 sm:grid-cols-3">
            <Field data-invalid={!!errors.customerName}>
              <FieldLabel htmlFor="customerName">Nome do cliente</FieldLabel>
              <Input id="customerName" {...register("customerName")} />
              <FieldError errors={errors.customerName ? [errors.customerName] : undefined} />
            </Field>
            <Field data-invalid={!!errors.customerPhone}>
              <FieldLabel htmlFor="customerPhone">Telefone</FieldLabel>
              <Input id="customerPhone" placeholder="(11) 99999-0000" {...register("customerPhone")} />
              <FieldError errors={errors.customerPhone ? [errors.customerPhone] : undefined} />
            </Field>
            <Field data-invalid={!!errors.customerEmail}>
              <FieldLabel htmlFor="customerEmail">E-mail (opcional)</FieldLabel>
              <Input id="customerEmail" type="email" {...register("customerEmail")} />
              <FieldError errors={errors.customerEmail ? [errors.customerEmail] : undefined} />
            </Field>
          </FieldGroup>
          <Button
            type="submit"
            className="w-fit cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Solicitando..." : "Solicitar financiamento"}
          </Button>
        </form>

        {requests.length > 0 && (
          <div className="flex flex-col gap-2 border-t pt-4">
            <p className="text-sm font-medium">Solicitações</p>
            {requests.map((request) => (
              <div
                key={request.id}
                className="flex items-center justify-between rounded-lg border p-3"
              >
                <div>
                  <p className="font-medium">{request.customerName}</p>
                  <p className="text-sm text-muted-foreground">
                    {request.customerPhone} · {formatCurrency(request.installmentEstimate)}/mês em{" "}
                    {request.termMonths}x
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusClassName[request.status]}`}
                  >
                    {financingRequestStatusLabel[request.status]}
                  </span>
                  {isGestor && request.status === "pendente" && (
                    <>
                      <Button
                        size="sm"
                        variant="outline"
                        className="cursor-pointer"
                        disabled={decidingId === request.id}
                        onClick={() => handleDecide(request.id, "aprovado")}
                      >
                        Aprovar
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        className="cursor-pointer"
                        disabled={decidingId === request.id}
                        onClick={() => handleDecide(request.id, "recusado")}
                      >
                        Recusar
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
