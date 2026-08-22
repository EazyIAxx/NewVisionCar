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
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres"),
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
      <div className="text-center">
        <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <MailCheck className="size-7" />
        </span>
        <h2 className="mt-5 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          Confirme seu e-mail
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground text-balance">
          Enviamos um link de confirmação para <strong>{sentTo}</strong>.
          Clique nele para ativar sua conta.
        </p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          Criar conta
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Comece a gerenciar sua revenda no RevendaPro.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FieldGroup>
          <Field data-invalid={!!errors.fullName}>
            <FieldLabel htmlFor="fullName">Nome completo</FieldLabel>
            <div className="relative">
              <User className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="fullName"
                autoComplete="name"
                placeholder="Seu nome"
                className="pl-9"
                {...register("fullName")}
              />
            </div>
            <FieldError
              errors={errors.fullName ? [errors.fullName] : undefined}
            />
          </Field>
          <Field data-invalid={!!errors.email}>
            <FieldLabel htmlFor="email">E-mail</FieldLabel>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="voce@revenda.com.br"
                className="pl-9"
                {...register("email")}
              />
            </div>
            <FieldError errors={errors.email ? [errors.email] : undefined} />
          </Field>
          <Field data-invalid={!!errors.password}>
            <FieldLabel htmlFor="password">Senha</FieldLabel>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                className="px-9"
                {...register("password")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground transition-colors hover:text-foreground"
                aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}
              >
                {showPassword ? (
                  <EyeOff className="size-4" />
                ) : (
                  <Eye className="size-4" />
                )}
              </button>
            </div>
            <FieldError
              errors={errors.password ? [errors.password] : undefined}
            />
          </Field>
        </FieldGroup>

        <Button type="submit" className="w-full cursor-pointer" disabled={isSubmitting}>
          {isSubmitting && <Loader2 className="animate-spin" />}
          {isSubmitting ? "Criando conta..." : "Criar conta"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Já tem conta?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}
