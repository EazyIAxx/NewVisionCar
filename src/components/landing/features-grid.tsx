"use client";

import {
  Car,
  Kanban,
  Receipt,
  Contact,
  Wallet,
  Trophy,
  FileText,
  Megaphone,
  Store,
  Wrench,
  ShieldCheck,
  Landmark,
  MessageCircle,
} from "lucide-react";

import SwipeStack from "@/components/effects/SwipeStack";

const available = [
  { icon: Car, title: "Estoque", description: "Cadastro de veículos com fotos, status e busca por marca/modelo." },
  { icon: Kanban, title: "CRM de leads", description: "Funil kanban do primeiro contato até a venda fechada." },
  { icon: Receipt, title: "Vendas", description: "Registro de venda com cliente, forma de pagamento e vendedor." },
  { icon: Contact, title: "Clientes", description: "Contato, status e histórico de compras, consolidado num só lugar." },
  { icon: Wallet, title: "Financeiro", description: "Faturamento, despesas e lucro líquido por período." },
  { icon: Trophy, title: "Desempenho", description: "Ranking e comissão dos vendedores, sem planilha paralela." },
];

const comingSoon = [
  { icon: FileText, title: "Nota Fiscal" },
  { icon: Megaphone, title: "Integrador de anúncios" },
  { icon: Store, title: "Vitrine pública" },
  { icon: Wrench, title: "Ordem de serviço" },
  { icon: ShieldCheck, title: "RENAVE" },
  { icon: Landmark, title: "Financiamento" },
  { icon: MessageCircle, title: "IA no WhatsApp" },
];

const cardTones = [
  "from-[#12205e] via-[#173a86] to-[#0b1330]",
  "from-[#0b3a52] via-[#12587e] to-[#0b1330]",
  "from-[#1b2a8f] via-[#1d4fa8] to-[#0b1330]",
  "from-[#0d2f66] via-[#1c6ba8] to-[#0b1330]",
  "from-[#132563] via-[#204a92] to-[#0b1330]",
  "from-[#0b3350] via-[#1a75a3] to-[#0b1330]",
];

export function FeaturesGrid() {
  const cards = available.map((item, index) => (
    <div
      key={item.title}
      className={`flex h-full w-full flex-col justify-between rounded-3xl border border-white/10 bg-gradient-to-br p-7 shadow-[0_20px_60px_-20px_rgba(37,150,224,0.4)] ${cardTones[index % cardTones.length]}`}
    >
      <item.icon className="size-9 text-white/90" strokeWidth={1.5} />
      <div>
        <h3 className="text-2xl font-semibold text-white">{item.title}</h3>
        <p className="mt-2 text-sm text-white/70">{item.description}</p>
      </div>
    </div>
  ));

  return (
    <section id="recursos" className="border-t border-white/10 px-6 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1fr_auto]">
        <div>
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Tudo que sua revenda precisa
          </h2>
          <p className="mt-4 max-w-md text-slate-400">
            Estoque, CRM, vendas, clientes, financeiro e desempenho já estão
            de pé. Arraste os cards ao lado pra conhecer cada um.
          </p>

          <p className="mt-10 text-sm font-medium text-slate-500">
            No roadmap
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            {comingSoon.map((item) => (
              <span
                key={item.title}
                className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-sm text-slate-400"
              >
                <item.icon className="size-3.5" />
                {item.title}
              </span>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center gap-3 justify-self-center">
          <div className="relative h-80 w-64 sm:h-96 sm:w-72">
            <SwipeStack
              cards={cards}
              sensitivity={120}
              sendToBackOnClick
            />
          </div>
          <p className="text-xs text-slate-500">Arraste ou clique pra ver o próximo</p>
        </div>
      </div>
    </section>
  );
}
