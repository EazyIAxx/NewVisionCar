import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Preciso de cartão de crédito para começar?",
    answer: "Não. Hoje não é preciso cartão pra criar a conta e usar a plataforma.",
  },
  {
    question: "Meus dados ficam seguros?",
    answer:
      "Sim. Cada revenda só acessa os próprios dados — isolamento total entre agências, com controle de acesso por papel (Gestor/Vendedor).",
  },
  {
    question: "Vendedor vê o financeiro da revenda?",
    answer:
      "Não. Vendedor só vê seus próprios leads, vendas e comissão. Financeiro e desempenho da equipe inteira são visíveis só pro Gestor.",
  },
  {
    question: "Dá pra usar no celular?",
    answer: "Sim, a plataforma é 100% pelo navegador, sem precisar instalar nada.",
  },
  {
    question: "Posso convidar mais de um vendedor?",
    answer:
      "Sim. O Gestor gera um código de convite em Configurações e cada vendedor entra com o papel certo.",
  },
  {
    question: "Já emite nota fiscal e integra com a RENAVE?",
    answer:
      "Esses módulos estão no roadmap (veja a seção \"Em breve\" acima). Hoje o foco é estoque, CRM, financeiro e desempenho.",
  },
];

export function Faq() {
  return (
    <section id="faq" className="border-t border-white/10 px-6 py-20">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Perguntas frequentes
          </h2>
        </div>

        <Accordion className="mt-10" multiple={false}>
          {faqs.map((faq) => (
            <AccordionItem
              key={faq.question}
              value={faq.question}
              className="border-white/10"
            >
              <AccordionTrigger className="text-white hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-slate-400">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
