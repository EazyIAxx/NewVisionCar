export type Weekday = "seg" | "ter" | "qua" | "qui" | "sex" | "sab" | "dom";

export const weekdayLabel: Record<Weekday, string> = {
  seg: "Seg",
  ter: "Ter",
  qua: "Qua",
  qui: "Qui",
  sex: "Sex",
  sab: "Sáb",
  dom: "Dom",
};

export const weekdayOrder: Weekday[] = ["seg", "ter", "qua", "qui", "sex", "sab", "dom"];

export type BusinessHours = {
  days: Weekday[];
  start: string; // "HH:mm"
  end: string; // "HH:mm"
};

export type AgentMessages = {
  welcome: string;
  afterHours: string;
  visitConfirmed: string;
};

export type AgentConfig = {
  enabled: boolean;
  phone: string;
  businessHours: BusinessHours;
  messages: AgentMessages;
};
