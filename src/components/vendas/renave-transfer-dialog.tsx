"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
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
import { startRenaveTransfer } from "@/app/(dashboard)/vendas/actions";

const renaveSchema = z.object({
  buyerDocument: z.string().min(11, "Informe o CPF do comprador"),
  buyerRg: z.string().min(5, "Informe o RG do comprador"),
  buyerAddress: z.string().min(5, "Informe o endereço completo"),
});

type RenaveFormValues = z.infer<typeof renaveSchema>;

export function RenaveTransferDialog({
  saleId,
  onStarted,
}: {
  saleId: string;
  onStarted: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RenaveFormValues>({
    resolver: zodResolver(renaveSchema),
  });

  async function onSubmit(values: RenaveFormValues) {
    setIsSubmitting(true);
    const result = await startRenaveTransfer({ saleId, ...values });
    if (result?.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }
    toast.success("Transferência RENAVE iniciada");
    setIsSubmitting(false);
    setOpen(false);
    reset();
    onStarted();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger
        render={<Button size="sm" variant="outline" className="cursor-pointer" />}
      >
        Iniciar transferência
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferência RENAVE</DialogTitle>
          <DialogDescription>
            Dados do comprador exigidos pelo RENAVE pra registrar a
            transferência de propriedade.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">
          <FieldGroup>
            <Field data-invalid={!!errors.buyerDocument}>
              <FieldLabel htmlFor="buyerDocument">CPF do comprador</FieldLabel>
              <Input
                id="buyerDocument"
                placeholder="000.000.000-00"
                {...register("buyerDocument")}
              />
              <FieldError
                errors={errors.buyerDocument ? [errors.buyerDocument] : undefined}
              />
            </Field>
            <Field data-invalid={!!errors.buyerRg}>
              <FieldLabel htmlFor="buyerRg">RG do comprador</FieldLabel>
              <Input
                id="buyerRg"
                placeholder="00.000.000-0"
                {...register("buyerRg")}
              />
              <FieldError errors={errors.buyerRg ? [errors.buyerRg] : undefined} />
            </Field>
            <Field data-invalid={!!errors.buyerAddress}>
              <FieldLabel htmlFor="buyerAddress">Endereço completo</FieldLabel>
              <Input
                id="buyerAddress"
                placeholder="Rua, número — Cidade/UF"
                {...register("buyerAddress")}
              />
              <FieldError
                errors={errors.buyerAddress ? [errors.buyerAddress] : undefined}
              />
            </Field>
          </FieldGroup>
          <Button
            type="submit"
            className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
            disabled={isSubmitting}
          >
            {isSubmitting && <Loader2 className="animate-spin" />}
            {isSubmitting ? "Enviando..." : "Enviar ao RENAVE"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
