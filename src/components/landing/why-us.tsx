import { Lock, Zap, MousePointerClick, Layers, TrendingUp, Users } from "lucide-react";

const items = [
  {
    icon: Lock,
    title: "Seus dados, sua revenda",
    description: "Isolamento total entre agências — cada revenda só acessa o que é dela.",
  },
  {
    icon: Users,
    title: "Papéis de verdade",
    description: "Gestor vê tudo. Vendedor vê só seus leads, vendas e comissão — na tela e no banco.",
  },
  {
    icon: Layers,
    title: "Tudo integrado",
    description: "Estoque, CRM, financeiro e comissão conversam entre si, sem retrabalho.",
  },
  {
    icon: Zap,
    title: "Rápido de começar",
    description: "Sem instalação. Cria a conta, cadastra o estoque e já está usando.",
  },
  {
    icon: MousePointerClick,
    title: "Fácil de usar",
    description: "Pensado pra quem vende carro no dia a dia, não pra quem só usa planilha.",
  },
  {
    icon: TrendingUp,
    title: "Cresce com você",
    description: "Do primeiro carro em estoque até uma equipe com vários vendedores.",
  },
];

export function WhyUs() {
  return (
    <section className="border-t border-white/10 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Por que o NewVisionCar
          </h2>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-6"
            >
              <span className="flex size-10 items-center justify-center rounded-lg bg-white/5 text-[#56d3f2]">
                <item.icon className="size-5" />
              </span>
              <h3 className="font-semibold text-white">{item.title}</h3>
              <p className="text-sm text-slate-400">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
