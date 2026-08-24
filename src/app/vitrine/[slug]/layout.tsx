import Image from "next/image";
import Link from "next/link";
import { Phone } from "lucide-react";

import { mockVitrineSettings } from "@/lib/mock/vitrine";

export default async function VitrineLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return (
    <div className="flex min-h-svh flex-col bg-white text-slate-900">
      <header className="bg-slate-950">
        <div className="relative mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <nav className="hidden items-center gap-6 sm:flex">
            <Link
              href={`/vitrine/${slug}`}
              className="text-sm font-semibold tracking-wide text-slate-300 hover:text-white"
            >
              ESTOQUE
            </Link>
          </nav>

          <Link
            href={`/vitrine/${slug}`}
            className="flex items-center gap-2 sm:absolute sm:left-1/2 sm:-translate-x-1/2"
          >
            <Image
              src="/logo-mark.png"
              alt=""
              width={28}
              height={19}
              className="h-6 w-auto"
            />
            <span className="text-lg font-bold tracking-tight text-white">
              {mockVitrineSettings.displayName}
            </span>
          </Link>

          <a
            href={`https://wa.me/${mockVitrineSettings.whatsapp}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 rounded-full bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] px-4 py-2 text-xs font-bold tracking-wide text-white hover:brightness-110"
          >
            <Phone className="size-3.5" />
            FALE NO WHATSAPP
          </a>
        </div>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="border-t border-slate-200 px-6 py-8 text-center text-sm text-slate-500">
        {mockVitrineSettings.displayName} · Feito com{" "}
        <span className="bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] bg-clip-text font-semibold text-transparent">
          NewVisionCar
        </span>
      </footer>
    </div>
  );
}
