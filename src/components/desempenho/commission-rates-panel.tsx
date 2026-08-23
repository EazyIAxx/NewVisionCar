"use client";

import { useState } from "react";
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
import { Field, FieldLabel } from "@/components/ui/field";
import { paymentMethodLabel, type PaymentMethod } from "@/lib/types/sale";
import type { CommissionRates } from "@/lib/types/performance";
import { saveCommissionRates } from "@/app/(dashboard)/desempenho/actions";

const paymentMethods = Object.keys(paymentMethodLabel) as PaymentMethod[];

export function CommissionRatesPanel({
  rates,
  onChange,
}: {
  rates: CommissionRates;
  onChange: (rates: CommissionRates) => void;
}) {
  const [percentInputs, setPercentInputs] = useState<Record<PaymentMethod, string>>(
    () =>
      Object.fromEntries(
        paymentMethods.map((method) => [method, String(rates[method] * 100)]),
      ) as Record<PaymentMethod, string>,
  );
  const [isSaving, setIsSaving] = useState(false);

  function handleRateChange(method: PaymentMethod, raw: string) {
    setPercentInputs((prev) => ({ ...prev, [method]: raw }));
    const value = Number(raw.replace(",", "."));
    if (Number.isFinite(value)) {
      onChange({ ...rates, [method]: value / 100 });
    }
  }

  async function handleSave() {
    setIsSaving(true);
    const result = await saveCommissionRates(rates);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Regras de comissão salvas");
    }
    setIsSaving(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Regras de comissão</CardTitle>
        <CardDescription>
          Percentual sobre o valor da venda, por forma de pagamento.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {paymentMethods.map((method) => (
            <Field key={method}>
              <FieldLabel htmlFor={`rate-${method}`}>
                {paymentMethodLabel[method]}
              </FieldLabel>
              <div className="relative">
                <Input
                  id={`rate-${method}`}
                  type="number"
                  step="0.1"
                  min="0"
                  value={percentInputs[method]}
                  onChange={(e) => handleRateChange(method, e.target.value)}
                  className="pr-7"
                />
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                  %
                </span>
              </div>
            </Field>
          ))}
        </div>
        <div className="flex justify-end">
          <Button
            className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Salvando..." : "Salvar regras"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
