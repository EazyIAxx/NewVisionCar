"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import { taxRegimeLabel, type FiscalSettings, type TaxRegime } from "@/lib/types/invoice";
import { saveFiscalSettings } from "@/app/(dashboard)/settings/fiscal/actions";

export function FiscalSettingsPanel({ initialSettings }: { initialSettings: FiscalSettings }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    const result = await saveFiscalSettings(settings);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Dados fiscais salvos");
      router.refresh();
    }
    setIsSaving(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Dados fiscais</CardTitle>
        <CardDescription>
          Usados na emissão de nota fiscal das vendas.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="cnpj">CNPJ</FieldLabel>
          <Input
            id="cnpj"
            value={settings.cnpj}
            onChange={(e) => setSettings((prev) => ({ ...prev, cnpj: e.target.value }))}
            placeholder="00.000.000/0000-00"
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field>
            <FieldLabel htmlFor="ie">Inscrição estadual</FieldLabel>
            <Input
              id="ie"
              value={settings.inscricaoEstadual}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, inscricaoEstadual: e.target.value }))
              }
              placeholder="000.000.000.000"
            />
          </Field>
          <Field>
            <FieldLabel htmlFor="im">Inscrição municipal</FieldLabel>
            <Input
              id="im"
              value={settings.inscricaoMunicipal}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, inscricaoMunicipal: e.target.value }))
              }
              placeholder="Opcional"
            />
          </Field>
        </div>
        <Field>
          <FieldLabel htmlFor="regime">Regime tributário</FieldLabel>
          <select
            id="regime"
            className="h-8 rounded-md border border-input bg-transparent px-3 text-sm dark:bg-input/30"
            value={settings.regime}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, regime: e.target.value as TaxRegime }))
            }
          >
            {(Object.keys(taxRegimeLabel) as TaxRegime[]).map((value) => (
              <option key={value} value={value}>
                {taxRegimeLabel[value]}
              </option>
            ))}
          </select>
        </Field>
        <div className="flex justify-end">
          <Button
            className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
            disabled={isSaving}
            onClick={handleSave}
          >
            {isSaving ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
