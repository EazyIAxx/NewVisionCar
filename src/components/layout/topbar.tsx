"use client";

import Link from "next/link";
import { Bell } from "lucide-react";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export function Topbar({
  title,
  pendingLeadsCount = 0,
}: {
  title: string;
  pendingLeadsCount?: number;
}) {
  return (
    <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="mr-2 h-4" />
      <h1 className="flex-1 text-sm font-medium">{title}</h1>
      <Link
        href="/crm"
        className="relative flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label={
          pendingLeadsCount > 0
            ? `${pendingLeadsCount} lead(s) novo(s) da vitrine aguardando atendimento`
            : "Nenhum lead novo aguardando atendimento"
        }
      >
        <Bell className="size-4" />
        {pendingLeadsCount > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex size-4 items-center justify-center rounded-full bg-accent text-[10px] font-medium text-accent-foreground">
            {pendingLeadsCount > 9 ? "9+" : pendingLeadsCount}
          </span>
        )}
      </Link>
      <ThemeToggle />
    </header>
  );
}
