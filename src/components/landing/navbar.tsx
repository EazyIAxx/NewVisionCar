import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";

const links = [
  { label: "Recursos", href: "#recursos" },
  { label: "Como funciona", href: "#como-funciona" },
  { label: "Preços", href: "#precos" },
  { label: "Perguntas", href: "#faq" },
];

export function LandingNavbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <div className="flex items-center gap-2">
          <Image
            src="/logo-mark.png"
            alt=""
            width={32}
            height={22}
            className="h-7 w-auto"
            priority
          />
          <span className="text-lg font-bold tracking-tight text-white">
            NewVisionCar
          </span>
        </div>

        <nav className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-slate-300 transition-colors hover:text-white"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            className="cursor-pointer text-slate-200 hover:bg-white/10 hover:text-white"
            render={<Link href="/login" />}
            nativeButton={false}
          >
            Entrar
          </Button>
          <Button
            className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
            render={<Link href="/signup" />}
            nativeButton={false}
          >
            Criar conta
          </Button>
        </div>
      </div>
    </header>
  );
}
