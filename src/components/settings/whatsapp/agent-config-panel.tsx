"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import {
  weekdayLabel,
  weekdayOrder,
  type AgentConfig,
  type Weekday,
} from "@/lib/types/whatsapp-agent";
import { saveAgentConfig } from "@/app/(dashboard)/settings/whatsapp/actions";

export function AgentConfigPanel({ initialConfig }: { initialConfig: AgentConfig }) {
  const router = useRouter();
  const [config, setConfig] = useState(initialConfig);
  const [isSaving, setIsSaving] = useState(false);

  function toggleDay(day: Weekday) {
    setConfig((prev) => ({
      ...prev,
      businessHours: {
        ...prev.businessHours,
        days: prev.businessHours.days.includes(day)
          ? prev.businessHours.days.filter((d) => d !== day)
          : [...prev.businessHours.days, day],
      },
    }));
  }

  async function handleSave() {
    setIsSaving(true);
    const result = await saveAgentConfig(config);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Configuração da BIA salva");
      router.refresh();
    }
    setIsSaving(false);
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Status</CardTitle>
              <CardDescription>
                Ative ou desative o atendimento automático da BIA.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex items-center justify-between rounded-lg border p-3">
                <div>
                  <p className="text-sm font-medium">Atendimento automático</p>
                  <p className="text-xs text-muted-foreground">
                    Com a BIA desativada, os leads do WhatsApp continuam
                    chegando, mas sem resposta automática.
                  </p>
                </div>
                <Switch
                  checked={config.enabled}
                  onCheckedChange={(enabled) =>
                    setConfig((prev) => ({ ...prev, enabled }))
                  }
                />
              </div>
              <Field>
                <FieldLabel htmlFor="phone">Número de WhatsApp da revenda</FieldLabel>
                <Input
                  id="phone"
                  value={config.phone}
                  onChange={(e) =>
                    setConfig((prev) => ({ ...prev, phone: e.target.value }))
                  }
                  placeholder="(11) 99999-0000"
                />
              </Field>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Horário de atendimento</CardTitle>
              <CardDescription>
                Dias e horário em que a BIA responde automaticamente.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {weekdayOrder.map((day) => {
                  const active = config.businessHours.days.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => toggleDay(day)}
                      className={cn(
                        "cursor-pointer rounded-full border px-3 py-1.5 text-sm font-medium transition-colors",
                        active
                          ? "border-transparent bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white"
                          : "border-input text-muted-foreground hover:bg-muted",
                      )}
                    >
                      {weekdayLabel[day]}
                    </button>
                  );
                })}
              </div>
              <div className="flex gap-4">
                <Field>
                  <FieldLabel htmlFor="start">Início</FieldLabel>
                  <Input
                    id="start"
                    type="time"
                    value={config.businessHours.start}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        businessHours: { ...prev.businessHours, start: e.target.value },
                      }))
                    }
                  />
                </Field>
                <Field>
                  <FieldLabel htmlFor="end">Fim</FieldLabel>
                  <Input
                    id="end"
                    type="time"
                    value={config.businessHours.end}
                    onChange={(e) =>
                      setConfig((prev) => ({
                        ...prev,
                        businessHours: { ...prev.businessHours, end: e.target.value },
                      }))
                    }
                  />
                </Field>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Mensagens padrão</CardTitle>
              <CardDescription>
                O que a BIA responde em cada situação. Edite à vontade.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <Field>
                <FieldLabel htmlFor="welcome">Boas-vindas</FieldLabel>
                <textarea
                  id="welcome"
                  rows={3}
                  className="rounded-md border border-input bg-transparent px-3 py-2 text-sm dark:bg-input/30"
                  value={config.messages.welcome}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      messages: { ...prev.messages, welcome: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="afterHours">Fora do horário</FieldLabel>
                <textarea
                  id="afterHours"
                  rows={3}
                  className="rounded-md border border-input bg-transparent px-3 py-2 text-sm dark:bg-input/30"
                  value={config.messages.afterHours}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      messages: { ...prev.messages, afterHours: e.target.value },
                    }))
                  }
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="visitConfirmed">Visita agendada</FieldLabel>
                <textarea
                  id="visitConfirmed"
                  rows={3}
                  className="rounded-md border border-input bg-transparent px-3 py-2 text-sm dark:bg-input/30"
                  value={config.messages.visitConfirmed}
                  onChange={(e) =>
                    setConfig((prev) => ({
                      ...prev,
                      messages: { ...prev.messages, visitConfirmed: e.target.value },
                    }))
                  }
                />
              </Field>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
              disabled={isSaving}
              onClick={handleSave}
            >
              {isSaving ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        </div>

        <div className="lg:sticky lg:top-4 lg:self-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Prévia — boas-vindas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 rounded-t-xl bg-[#0b3d33] px-3 py-2">
                <span className="flex size-7 items-center justify-center rounded-full bg-gradient-to-br from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-xs font-bold text-white">
                  B
                </span>
                <p className="text-xs font-medium text-white">BIA</p>
              </div>
              <div className="rounded-b-xl bg-slate-950 p-3">
                <p className="max-w-[85%] rounded-2xl rounded-bl-sm bg-slate-800 px-3 py-2 text-sm text-slate-100">
                  {config.messages.welcome || "Sua mensagem aparece aqui..."}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
