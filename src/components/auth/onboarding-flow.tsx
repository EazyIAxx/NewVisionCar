"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, KeyRound } from "lucide-react";
import { toast } from "sonner";

import {
  createAgencyAndSetGestor,
  joinAgencyWithInvite,
} from "@/app/onboarding/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

type Mode = "choose" | "create" | "join";

const createAgencySchema = z.object({
  name: z.string().min(2, "Informe o nome da revenda"),
});
type CreateAgencyValues = z.infer<typeof createAgencySchema>;

const joinAgencySchema = z.object({
  code: z.string().min(4, "Código de convite inválido"),
});
type JoinAgencyValues = z.infer<typeof joinAgencySchema>;

export function OnboardingFlow() {
  const [mode, setMode] = useState<Mode>("choose");

  if (mode === "choose") {
    return (
      <div className="grid gap-4">
        <button
          type="button"
          onClick={() => setMode("create")}
          className="w-full text-left"
        >
          <Card className="transition-colors hover:border-primary">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <Building2 className="size-6 text-primary" />
              <div>
                <CardTitle>Criar minha revenda</CardTitle>
                <CardDescription>
                  Você será o Gestor da nova agência.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </button>
        <button
          type="button"
          onClick={() => setMode("join")}
          className="w-full text-left"
        >
          <Card className="transition-colors hover:border-primary">
            <CardHeader className="flex-row items-center gap-3 space-y-0">
              <KeyRound className="size-6 text-primary" />
              <div>
                <CardTitle>Tenho um código de convite</CardTitle>
                <CardDescription>
                  Entre em uma revenda existente como Vendedor.
                </CardDescription>
              </div>
            </CardHeader>
          </Card>
        </button>
      </div>
    );
  }

  if (mode === "create") {
    return <CreateAgencyForm onBack={() => setMode("choose")} />;
  }

  return <JoinAgencyForm onBack={() => setMode("choose")} />;
}

function CreateAgencyForm({ onBack }: { onBack: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateAgencyValues>({ resolver: zodResolver(createAgencySchema) });

  async function onSubmit(values: CreateAgencyValues) {
    setIsSubmitting(true);
    const result = await createAgencyAndSetGestor(values.name);
    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Criar minha revenda</CardTitle>
        <CardDescription>Dê um nome para sua agência.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!errors.name}>
              <FieldLabel htmlFor="name">Nome da revenda</FieldLabel>
              <Input
                id="name"
                placeholder="Ex: Auto Center Silva"
                {...register("name")}
              />
              <FieldError errors={errors.name ? [errors.name] : undefined} />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Criando..." : "Criar revenda"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}

function JoinAgencyForm({ onBack }: { onBack: () => void }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<JoinAgencyValues>({ resolver: zodResolver(joinAgencySchema) });

  async function onSubmit(values: JoinAgencyValues) {
    setIsSubmitting(true);
    const result = await joinAgencyWithInvite(values.code);
    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Entrar com convite</CardTitle>
        <CardDescription>
          Informe o código que o gestor da revenda te enviou.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent>
          <FieldGroup>
            <Field data-invalid={!!errors.code}>
              <FieldLabel htmlFor="code">Código de convite</FieldLabel>
              <Input
                id="code"
                placeholder="Ex: A1B2C3"
                {...register("code")}
              />
              <FieldError errors={errors.code ? [errors.code] : undefined} />
            </Field>
          </FieldGroup>
        </CardContent>
        <CardFooter className="flex gap-2">
          <Button type="button" variant="outline" onClick={onBack}>
            Voltar
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Entrando..." : "Entrar na revenda"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
