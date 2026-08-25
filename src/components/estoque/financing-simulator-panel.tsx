"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Field, FieldLabel } from "@/components/ui/field";
import { formatCurrency } from "@/lib/utils";

// Taxa ilustrativa — sem integração real com banco/financeira ainda (Fase D).
const MONTHLY_RATE = 0.015;
const TERMS = [12, 24, 36, 48, 60];

export function FinancingSimulatorPanel({ price }: { price: number }) {
  const [downPayment, setDownPayment] = useState(String(Math.round(price * 0.2)));
  const [term, setTerm] = useState(48);

  const financedAmount = Math.max(price - Number(downPayment || 0), 0);
  const installment =
    financedAmount > 0
      ? (financedAmount * MONTHLY_RATE) / (1 - Math.pow(1 + MONTHLY_RATE, -term))
      : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Calculator className="size-4" /> Simulação de financiamento
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
      </CardContent>
    </Card>
  );
}
