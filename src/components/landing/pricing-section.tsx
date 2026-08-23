import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { mockPlans } from "@/lib/mock/billing";

export function PricingSection() {
  return (
    <section id="precos" className="border-t border-white/10 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Planos por tamanho de revenda
          </h2>
          <p className="mt-4 text-slate-400">
            14 dias grátis em qualquer plano, sem cartão de crédito. Cancele
            quando quiser.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-3">
          {mockPlans.map((plan) => (
            <div
              key={plan.id}
              className={cn(
                "relative flex flex-col gap-6 rounded-3xl border border-white/10 bg-white/[0.03] p-8",
                plan.highlight && "border-[#2596e0]/60 bg-white/[0.06]",
              )}
            >
              {plan.highlight && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] px-3 py-1 text-xs font-medium text-white">
                  Mais popular
                </span>
              )}

              <div>
                <h3 className="font-semibold text-white">{plan.name}</h3>
                <p className="mt-2">
                  <span className="text-3xl font-bold text-white">
                    {formatCurrency(plan.price)}
                  </span>
                  <span className="text-slate-400">/mês</span>
                </p>
              </div>

              <ul className="flex flex-1 flex-col gap-3 text-sm">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2">
                    <Check className="mt-0.5 size-4 shrink-0 text-[#56d3f2]" />
                    <span className="text-slate-300">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                className={cn(
                  "cursor-pointer",
                  plan.highlight
                    ? "bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
                    : "border-white/15 bg-transparent text-slate-200 hover:bg-white/10 hover:text-white",
                )}
                variant={plan.highlight ? "default" : "outline"}
                render={<Link href="/signup" />}
                nativeButton={false}
              >
                Começar grátis
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
