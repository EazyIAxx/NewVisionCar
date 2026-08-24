"use client";

import { useState } from "react";
import { Calculator } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatCurrency } from "@/lib/utils";

// Taxa ilustrativa — sem integração real com banco/financeira ainda (M15).
const MONTHLY_RATE = 0.015;
const TERMS = [12, 24, 36, 48, 60];

export function FinancingSimulator({ price }: { price: number }) {
  const [open, setOpen] = useState(false);
  const [downPayment, setDownPayment] = useState(String(Math.round(price * 0.2)));
  const [term, setTerm] = useState(48);

  const financedAmount = Math.max(price - Number(downPayment || 0), 0);
  const installment =
    financedAmount > 0
      ? (financedAmount * MONTHLY_RATE) / (1 - Math.pow(1 + MONTHLY_RATE, -term))
      : 0;

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
    <div className="rounded-2xl border border-slate-200 p-5">
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
      </div>
    </div>
  );
}
