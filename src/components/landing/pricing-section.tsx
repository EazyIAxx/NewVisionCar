import Link from "next/link";
import { Check } from "lucide-react";

import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { PLAN } from "@/lib/billing/plan";

export function PricingSection() {
  return (
    <section id="precos" className="border-t border-white/10 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Um plano só, sem pegadinha
          </h2>
          <p className="mt-4 text-slate-400">
            14 dias grátis, sem cartão de crédito. Cancele quando quiser.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-md">
          <div className="relative flex flex-col gap-6 rounded-3xl border border-[#2596e0]/60 bg-white/[0.06] p-8">
            <div>
              <h3 className="font-semibold text-white">{PLAN.name}</h3>
              <p className="mt-2">
                <span className="text-3xl font-bold text-white">
                  {formatCurrency(PLAN.price)}
                </span>
                <span className="text-slate-400">/mês</span>
              </p>
            </div>

            <ul className="flex flex-1 flex-col gap-3 text-sm">
              {PLAN.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2">
                  <Check className="mt-0.5 size-4 shrink-0 text-[#56d3f2]" />
                  <span className="text-slate-300">{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
              render={<Link href="/signup" />}
              nativeButton={false}
            >
              Começar grátis
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
