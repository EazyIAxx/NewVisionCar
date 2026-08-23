import { Rocket, Gauge, TrendingUp } from "lucide-react";

const items = [
  {
    icon: Rocket,
    title: "Comece organizado",
    description:
      "Cadastre o estoque, convide sua equipe e defina os papéis (Gestor/Vendedor) em poucos minutos.",
  },
  {
    icon: Gauge,
    title: "Acompanhe o dia a dia",
    description:
      "Leads, vendas e comissão sempre atualizados, sem depender de planilha ou grupo de WhatsApp pra saber o que está acontecendo.",
  },
  {
    icon: TrendingUp,
    title: "Cresça sem trocar de sistema",
    description:
      "Do primeiro veículo em estoque até uma equipe grande de vendedores, a plataforma acompanha o tamanho da sua revenda.",
  },
];

export function ValueProps() {
  return (
    <section className="border-t border-white/10 px-6 py-20">
      <div className="mx-auto grid max-w-6xl gap-8 sm:grid-cols-3">
        {items.map((item) => (
          <div key={item.title} className="flex flex-col gap-3">
            <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white">
              <item.icon className="size-5" />
            </span>
            <h3 className="text-lg font-semibold text-white">{item.title}</h3>
            <p className="text-sm text-slate-400">{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
