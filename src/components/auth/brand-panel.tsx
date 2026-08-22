import { Car, Kanban, Trophy } from "lucide-react";

const valueProps = [
  {
    icon: Car,
    title: "Estoque em um só lugar",
    description: "Fotos, preço e status de cada veículo, sempre atualizados.",
  },
  {
    icon: Kanban,
    title: "Leads que não se perdem",
    description: "Funil de vendas do primeiro contato até a chave na mão.",
  },
  {
    icon: Trophy,
    title: "Comissão sem planilha",
    description: "0,5% por veículo vendido, calculado automaticamente.",
  },
];

export function BrandPanel() {
  return (
    <div className="relative hidden overflow-hidden bg-primary px-12 py-10 text-primary-foreground md:flex md:flex-col md:justify-between">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-24 -top-24 size-96 rotate-12 bg-brand-accent/90"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-10 size-72 rotate-45 bg-white/10"
      />

      <span className="relative font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
        Revenda<span className="text-brand-accent">Pro</span>
      </span>

      <div className="relative max-w-md">
        <h1 className="font-[family-name:var(--font-display)] text-4xl font-bold leading-tight tracking-tight text-balance">
          Gerencie sua revenda com clareza.
        </h1>
        <p className="mt-4 text-base text-primary-foreground/80 text-balance">
          Estoque, financeiro, CRM e comissão dos vendedores num só sistema —
          feito para o dia a dia de uma revenda de veículos.
        </p>

        <ul className="mt-10 flex flex-col gap-6">
          {valueProps.map((item) => (
            <li key={item.title} className="flex items-start gap-3">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-white/10">
                <item.icon className="size-5" />
              </span>
              <div>
                <p className="font-medium">{item.title}</p>
                <p className="text-sm text-primary-foreground/70">
                  {item.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <p className="relative text-xs text-primary-foreground/60">
        © {new Date().getFullYear()} RevendaPro. Feito para revendas
        categoria B.
      </p>
    </div>
  );
}
