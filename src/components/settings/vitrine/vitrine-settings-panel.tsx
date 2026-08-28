"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Field, FieldLabel } from "@/components/ui/field";
import type { VitrineSettings } from "@/lib/types/vitrine";
import { saveVitrineSettings } from "@/app/(dashboard)/settings/vitrine/actions";

export function VitrineSettingsPanel({
  initialSettings,
}: {
  initialSettings: VitrineSettings;
}) {
  const [settings, setSettings] = useState(initialSettings);
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    const result = await saveVitrineSettings(settings);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Vitrine atualizada");
    }
    setIsSaving(false);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Vitrine pública</CardTitle>
        <CardDescription>
          Nome, endereço e cor de destaque da página pública do seu estoque.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <Field>
          <FieldLabel htmlFor="displayName">Nome de exibição</FieldLabel>
          <Input
            id="displayName"
            value={settings.displayName}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, displayName: e.target.value }))
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="slug">Endereço da vitrine</FieldLabel>
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">/vitrine/</span>
            <Input
              id="slug"
              value={settings.slug}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, slug: e.target.value }))
              }
            />
          </div>
        </Field>
        <Field>
          <FieldLabel htmlFor="whatsapp">WhatsApp</FieldLabel>
          <Input
            id="whatsapp"
            placeholder="5511988880000"
            value={settings.whatsapp}
            onChange={(e) =>
              setSettings((prev) => ({ ...prev, whatsapp: e.target.value }))
            }
          />
        </Field>
        <Field>
          <FieldLabel htmlFor="accentColor">Cor de destaque</FieldLabel>
          <div className="flex items-center gap-2">
            <input
              id="accentColor"
              type="color"
              value={settings.accentColor}
              onChange={(e) =>
                setSettings((prev) => ({ ...prev, accentColor: e.target.value }))
              }
              className="h-8 w-14 cursor-pointer rounded-md border border-input bg-transparent"
            />
            <span className="text-sm text-muted-foreground">
              {settings.accentColor}
            </span>
          </div>
        </Field>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button
            variant="outline"
            className="cursor-pointer"
            render={<Link href={`/vitrine/${settings.slug}`} target="_blank" />}
            nativeButton={false}
          >
            <ExternalLink />
            Ver vitrine
          </Button>
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
