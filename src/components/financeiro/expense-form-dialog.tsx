"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, Plus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field";
import { expenseCategoryLabel, type ExpenseCategory } from "@/lib/types/finance";
import { createExpense } from "@/app/(dashboard)/financeiro/actions";

const expenseSchema = z.object({
  category: z.enum(["aluguel", "funcionarios", "manutencao", "marketing"]),
  description: z.string().min(1, "Descreva a despesa"),
  amount: z.number().min(0.01, "Informe o valor"),
  date: z.string().min(1, "Informe a data"),
});

type ExpenseFormValues = z.infer<typeof expenseSchema>;

export function ExpenseFormDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseSchema),
    defaultValues: { category: "aluguel" },
  });

  async function onSubmit(values: ExpenseFormValues) {
    setIsSubmitting(true);
    const result = await createExpense(values);
    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }
    toast.success("Despesa lançada");
    setIsSubmitting(false);
    setOpen(false);
    reset();
    router.refresh();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={
          <Button className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110" />
        }
      >
        <Plus />
        Nova despesa
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nova despesa</DialogTitle>
          <DialogDescription>
            Registre uma saída de caixa da revenda.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="category">Categoria</FieldLabel>
              <select
                id="category"
                className="h-8 rounded-md border border-input bg-transparent px-3 text-sm dark:bg-input/30"
                {...register("category")}
              >
                {(Object.keys(expenseCategoryLabel) as ExpenseCategory[]).map(
                  (value) => (
                    <option key={value} value={value}>
                      {expenseCategoryLabel[value]}
                    </option>
                  ),
                )}
              </select>
            </Field>
            <Field data-invalid={!!errors.description}>
              <FieldLabel htmlFor="description">Descrição</FieldLabel>
              <Input
                id="description"
                placeholder="Ex: Aluguel do showroom"
                {...register("description")}
              />
              <FieldError
                errors={errors.description ? [errors.description] : undefined}
              />
            </Field>
            <Field data-invalid={!!errors.amount}>
              <FieldLabel htmlFor="amount">Valor</FieldLabel>
              <Input
                id="amount"
                type="number"
                step="0.01"
                {...register("amount", { valueAsNumber: true })}
              />
              <FieldError errors={errors.amount ? [errors.amount] : undefined} />
            </Field>
            <Field data-invalid={!!errors.date}>
              <FieldLabel htmlFor="date">Data</FieldLabel>
              <Input id="date" type="date" {...register("date")} />
              <FieldError errors={errors.date ? [errors.date] : undefined} />
            </Field>
          </FieldGroup>
          <Button
            type="submit"
            className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Salvando..." : "Lançar despesa"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
