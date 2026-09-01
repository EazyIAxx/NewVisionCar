"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Lock, Mail, MailCheck, User } from "lucide-react";
import { toast } from "sonner";

import { signup } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const signupSchema = z.object({
  fullName: z.string().min(2, "Informe seu nome"),
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z
    .string()
    .min(8, "A senha precisa ter ao menos 8 caracteres")
    .regex(/[A-Z]/, "A senha precisa ter ao menos uma letra maiúscula")
    .regex(/[0-9]/, "A senha precisa ter ao menos um número")
    .regex(/[^A-Za-z0-9]/, "A senha precisa ter ao menos um caractere especial"),
});

type SignupValues = z.infer<typeof signupSchema>;

export function SignupForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [sentTo, setSentTo] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupValues>({ resolver: zodResolver(signupSchema) });

  async function onSubmit(values: SignupValues) {
    setIsSubmitting(true);
    const result = await signup(values.fullName, values.email, values.password);
    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }
    setSentTo(values.email);
    setIsSubmitting(false);
  }

  if (sentTo) {
    return (
      <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6 text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-gradient-to-br from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white">
          <MailCheck className="size-7" />
        </span>
        <h2 className="mt-5 text-xl font-bold tracking-tight text-white">
          Confirme seu e-mail
        </h2>
        <p className="mt-1.5 text-sm text-slate-400 text-balance">
          Enviamos um link de confirmação para{" "}
          <strong className="text-slate-200">{sentTo}</strong>. Clique nele
          para ativar sua conta.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold tracking-tight text-white">
          Criar conta
        </h2>
        <p className="mt-1 text-sm text-slate-400">
          Comece a gerenciar sua revenda no NewVisionCar.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FieldGroup>
          <Field data-invalid={!!errors.fullName}>
            <FieldLabel htmlFor="fullName" className="text-slate-200">
              Nome completo
            </FieldLabel>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                id="fullName"
                autoComplete="name"
                placeholder="Seu nome"
                className="border-slate-700 bg-slate-800/60 pl-9 text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-500"
                {...register("fullName")}
              />
            </div>
            <FieldError
              errors={errors.fullName ? [errors.fullName] : undefined}
            />
          </Field>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email" className="text-slate-200">
              E-mail
            </FieldLabel>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="voce@revenda.com.br"
                className="border-slate-700 bg-slate-800/60 pl-9 text-slate-100 placeholder:text-slate-500 focus-visible:border-blue-500"
                {...register("email")}
              />
            </div>
            <FieldError errors={errors.email ? [errors.email] : undefined} />
          </Field>
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password" className="text-slate-200">
              Senha
            </FieldLabel>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-500" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="border-slate-700 bg-slate-800/60 px-9 text-slate-100 focus-visible:border-blue-500"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-slate-500 transition-colors hover:text-slate-300"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <p className="text-xs text-slate-500">
              Mínimo 8 caracteres, com 1 letra maiúscula, 1 número e 1
              caractere especial.
            </p>
            <FieldError
              errors={errors.password ? [errors.password] : undefined}
            />
          </Field>
        </FieldGroup>

        <Button
          type="submit"
          className="w-full cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
          disabled={isSubmitting}
        >
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>
        <p className="border-t border-slate-800 pt-4 text-center text-sm text-slate-400">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="font-medium text-blue-400 underline-offset-4 hover:underline"
          >
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}
