import type { AgentConfig } from "@/lib/types/whatsapp-agent";

// TODO(M8 backend): substituir por leitura/escrita real em `agencies` (ou
// tabela `whatsapp_agent_config`) + integração com WhatsApp Business Cloud API.
export const mockAgentConfig: AgentConfig = {
  enabled: true,
  phone: "(11) 98888-0000",
  businessHours: {
    days: ["seg", "ter", "qua", "qui", "sex"],
    start: "08:00",
    end: "18:00",
  },
  messages: {
    welcome: "Oi! Sou a BIA, assistente virtual aqui da loja. Como posso te ajudar? 🚗",
    afterHours: "Nosso atendimento humano volta amanhã às 8h. Mas já posso consultar o estoque e agendar sua visita!",
    visitConfirmed: "Visita agendada! Vou te mandar um lembrete 1h antes. Até lá 👋",
  },
};
