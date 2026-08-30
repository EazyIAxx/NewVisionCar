import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number, options?: { showCents?: boolean }) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: options?.showCents ? 2 : 0,
    minimumFractionDigits: options?.showCents ? 2 : 0,
  }).format(value)
}

export function formatKm(value: number) {
  return `${new Intl.NumberFormat("pt-BR").format(value)} km`
}
