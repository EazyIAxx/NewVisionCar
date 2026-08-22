"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { toast } from "sonner";

import { login } from "@/app/(auth)/actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";

const loginSchema = z.object({
  email: z.string().min(1, "Informe o e-mail").email("E-mail inválido"),
  password: z.string().min(6, "A senha precisa ter ao menos 6 caracteres"),
});

type LoginValues = z.infer<typeof loginSchema>;

export function LoginForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginValues>({ resolver: zodResolver(loginSchema) });

  async function onSubmit(values: LoginValues) {
    setIsSubmitting(true);
    const result = await login(values.email, values.password);
    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
    }
    // Em caso de sucesso, a Server Action já redireciona para /dashboard.
  }

  return (
    <div>
      <div className="mb-8">
        <h2 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
          Entrar
        </h2>
        <p className="mt-1.5 text-sm text-muted-foreground">
          Acesse sua conta para gerenciar sua revenda.
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <FieldGroup>
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
            <div className="flex items-center justify-between">
              <FieldLabel htmlFor="password">Senha</FieldLabel>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
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
          {isSubmitting ? "Entrando..." : "Entrar"}
        </Button>
        <p className="text-center text-sm text-muted-foreground">
          Não tem conta?{" "}
          <Link
            href="/signup"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Criar conta
          </Link>
        </p>
      </form>
    </div>
  );
}
