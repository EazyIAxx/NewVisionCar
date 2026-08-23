"use client";

import AnimatedList from "@/components/effects/AnimatedList";

const modules = [
  "Estoque de veículos",
  "CRM de leads (Kanban)",
  "Vendas",
  "Clientes",
  "Financeiro",
  "Desempenho e comissão",
  "Nota fiscal (em breve)",
  "Integrador de anúncios (em breve)",
  "Vitrine pública (em breve)",
  "RENAVE (em breve)",
];

export function ModuleListSection() {
  return (
    <section className="border-t border-white/10 px-6 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tudo isso, sem sair da plataforma
          </h2>
          <p className="mt-4 max-w-md text-slate-400">
            Cada módulo já nasce integrado aos outros: uma venda registrada
            atualiza o financeiro e a comissão do vendedor na hora.
          </p>
        </div>

        <div className="flex justify-center lg:justify-end">
          <AnimatedList
            items={modules}
            showGradients
            displayScrollbar={false}
            className="w-full max-w-sm"
          />
        </div>
      </div>
    </section>
  );
}
