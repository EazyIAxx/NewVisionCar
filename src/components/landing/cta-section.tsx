import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import ElectricBorder from "@/components/effects/ElectricBorder";

export function CtaSection() {
  return (
    <section className="border-t border-white/10 px-6 py-20">
      <div className="mx-auto max-w-4xl">
        <ElectricBorder color="#2596e0" speed={1} chaos={0.3} borderRadius={24}>
          <div className="flex flex-col items-center gap-6 rounded-3xl bg-gradient-to-br from-[#0b1330] via-[#0e1a3d] to-[#0b1330] px-8 py-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Pronto pra organizar sua revenda?
            </h2>
            <p className="max-w-xl text-slate-400">
              Crie sua conta, cadastre o estoque e convide sua equipe. Sem
              cartão de crédito.
            </p>
            <Button
              size="lg"
              className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] px-6 text-white hover:brightness-110"
              render={<Link href="/signup" />}
              nativeButton={false}
            >
              Criar conta grátis
              <ArrowRight />
            </Button>
          </div>
        </ElectricBorder>
      </div>
    </section>
  );
}
