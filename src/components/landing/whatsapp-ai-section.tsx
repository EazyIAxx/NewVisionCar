"use client";

import { motion } from "motion/react";
import { CalendarCheck, MessageCircleMore, Search, Zap } from "lucide-react";

const highlights = [
  {
    icon: Zap,
    text: "Responde na hora, mesmo fora do horário comercial",
  },
  {
    icon: Search,
    text: "Consulta o estoque em tempo real antes de responder",
  },
  {
    icon: CalendarCheck,
    text: "Agenda a visita direto no calendário do CRM",
  },
  {
    icon: MessageCircleMore,
    text: "Nenhum lead fica sem resposta esperando um vendedor",
  },
];

type Message = {
  from: "cliente" | "bia";
  text: string;
};

const conversation: Message[] = [
  { from: "cliente", text: "Oi! Vi o Corolla 2023 no anúncio, ainda tá disponível?" },
  {
    from: "bia",
    text: "Oi! Sim 🚗 Toyota Corolla XEi 2023, prata, automático, 32.000km. Quer agendar uma visita pra ver o carro e fazer um test-drive?",
  },
  { from: "cliente", text: "Quero, pode ser amanhã de tarde?" },
  { from: "bia", text: "Tenho 15h ou 16h30 amanhã. Qual prefere?" },
  { from: "cliente", text: "15h tá ótimo" },
  {
    from: "bia",
    text: "Visita agendada pra amanhã às 15h ✅ Vou te mandar o endereço e um lembrete 1h antes.",
  },
];

function PhoneMockup() {
  return (
    <div className="relative mx-auto w-[300px] rounded-[2.5rem] border-[6px] border-slate-800 bg-slate-900 shadow-2xl">
      <div className="absolute left-1/2 top-0 z-10 h-5 w-28 -translate-x-1/2 rounded-b-2xl bg-slate-800" />

      <div className="flex h-[560px] flex-col overflow-hidden rounded-[2rem]">
        <div className="flex items-center gap-3 bg-[#0b3d33] px-4 pb-3 pt-7">
          <span className="flex size-9 items-center justify-center rounded-full bg-gradient-to-br from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-sm font-bold text-white">
            B
          </span>
          <div>
            <p className="text-sm font-semibold text-white">BIA</p>
            <p className="flex items-center gap-1 text-xs text-emerald-300">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              atendente virtual · online
            </p>
          </div>
        </div>

        <div
          className="flex flex-1 flex-col gap-2 overflow-y-auto px-3 py-4"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)",
            backgroundSize: "16px 16px",
            backgroundColor: "#0a0f1e",
          }}
        >
          {conversation.map((message, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.35, duration: 0.3 }}
              className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                message.from === "cliente"
                  ? "self-end rounded-br-sm bg-[#2596e0] text-white"
                  : "self-start rounded-bl-sm bg-slate-800 text-slate-100"
              }`}
            >
              {message.text}
            </motion.div>
          ))}

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: conversation.length * 0.35, duration: 0.3 }}
            className="self-start rounded-2xl rounded-bl-sm bg-status-available/15 px-3 py-2 text-xs font-medium text-status-available"
          >
            ✓ Lead sincronizado com o CRM — visita atribuída a Ana Souza
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export function WhatsappAiSection() {
  return (
    <section className="border-t border-white/10 px-6 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        <div>
          <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-medium text-slate-300">
            O diferencial
          </span>

          <h2 className="mt-5 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Conheça a{" "}
            <span className="bg-gradient-to-r from-[#2596e0] to-[#56d3f2] bg-clip-text text-transparent">
              BIA
            </span>
            , sua atendente de IA no WhatsApp
          </h2>

          <p className="mt-4 max-w-lg text-slate-400">
            Enquanto um vendedor não pode responder na hora, a BIA já está
            conversando com o cliente: tira dúvida sobre o veículo, confere o
            estoque e agenda a visita — sem o lead esfriar esperando alguém
            ver a mensagem.
          </p>

          <ul className="mt-8 flex flex-col gap-4">
            {highlights.map((item) => (
              <li key={item.text} className="flex items-start gap-3">
                <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-[#56d3f2]">
                  <item.icon className="size-4" />
                </span>
                <span className="text-sm text-slate-300">{item.text}</span>
              </li>
            ))}
          </ul>

          <span className="mt-8 inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1.5 text-xs font-medium text-slate-400">
            Em breve na plataforma
          </span>
        </div>

        <PhoneMockup />
      </div>
    </section>
  );
}
