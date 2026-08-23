"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building2, KeyRound, Loader2 } from "lucide-react";
import { toast } from "sonner";

import {
  createAgencyAndSetGestor,
  joinAgencyWithInvite,
} from "@/app/(auth)/onboarding/actions";
import { Button } from "@/components/ui/button";
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
      <div className="flex flex-col gap-4">
        <button
          type="button"
          onClick={() => setMode("create")}
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-colors hover:border-blue-500"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white">
            <Building2 className="size-5" />
          </span>
          <div>
            <p className="font-medium text-white">Criar minha revenda</p>
            <p className="text-sm text-slate-400">
              Você será o Gestor da nova agência.
            </p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setMode("join")}
          className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-800 bg-slate-900/60 p-4 text-left transition-colors hover:border-blue-500"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white">
            <KeyRound className="size-5" />
          </span>
          <div>
            <p className="font-medium text-white">Tenho um código de convite</p>
            <p className="text-sm text-slate-400">
              Entre em uma revenda existente como Vendedor.
            </p>
          </div>
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
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Criar minha revenda
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Dê um nome para sua agência.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FieldGroup>
          <Field data-invalid={!!errors.name}>
            <FieldLabel htmlFor="name" className="text-slate-200">
              Nome da revenda
            </FieldLabel>
            <Input
              id="name"
              placeholder="Ex: Auto Center Silva"
              className="border-slate-700 bg-slate-800/60 text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-500"
              {...register("name")}
            />
            <FieldError errors={errors.name ? [errors.name] : undefined} />
          </Field>
        </FieldGroup>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={onBack}
          >
            Voltar
          </Button>
          <Button
            type="submit"
            className="flex-1 cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Criando..." : "Criar revenda"}
          </Button>
        </div>
      </form>
    </div>
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
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Entrar com convite
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Informe o código que o gestor da revenda te enviou.
        </p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FieldGroup>
          <Field data-invalid={!!errors.code}>
            <FieldLabel htmlFor="code" className="text-slate-200">
              Código de convite
            </FieldLabel>
            <Input
              id="code"
              placeholder="Ex: A1B2C3"
              className="border-slate-700 bg-slate-800/60 text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-500"
              {...register("code")}
            />
            <FieldError errors={errors.code ? [errors.code] : undefined} />
          </Field>
        </FieldGroup>
        <div className="flex gap-2">
          <Button
            type="button"
            variant="outline"
            className="cursor-pointer"
            onClick={onBack}
          >
            Voltar
          </Button>
          <Button
            type="submit"
            className="flex-1 cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Entrando..." : "Entrar na revenda"}
          </Button>
        </div>
      </form>
    </div>
  );
}
