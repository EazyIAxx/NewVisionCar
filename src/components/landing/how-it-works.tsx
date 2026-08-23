const steps = [
  {
    number: "01",
    title: "Cadastre o veículo",
    description: "Marca, modelo, fotos, custo e preço — tudo no Estoque.",
  },
  {
    number: "02",
    title: "Publique o anúncio",
    description: "Divulgue o veículo (integração com portais no roadmap).",
  },
  {
    number: "03",
    title: "Atenda o lead",
    description: "Do primeiro contato até a visita, acompanhado no CRM.",
  },
  {
    number: "04",
    title: "Registre a venda",
    description: "Cliente, forma de pagamento e comissão do vendedor.",
  },
  {
    number: "05",
    title: "Acompanhe os resultados",
    description: "Lucro líquido no Financeiro, ranking no Desempenho.",
  },
];

export function HowItWorks() {
  return (
    <section id="como-funciona" className="border-t border-white/10 px-6 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Como funciona
          </h2>
          <p className="mt-4 text-slate-400">
            Do cadastro do veículo até o resultado no final do mês, sem sair
            da plataforma.
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step) => (
            <div key={step.number} className="flex flex-col gap-2">
              <span className="bg-gradient-to-r from-[#2596e0] to-[#56d3f2] bg-clip-text text-3xl font-bold text-transparent">
                {step.number}
              </span>
              <h3 className="font-semibold text-white">{step.title}</h3>
              <p className="text-sm text-slate-400">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
