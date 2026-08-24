import Image from "next/image";
import Link from "next/link";

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
      <header className="border-b border-slate-200">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href={`/vitrine/${slug}`} className="flex items-center gap-2">
            <Image
              src="/logo-mark.png"
              alt=""
              width={28}
              height={19}
              className="h-6 w-auto"
            />
            <span className="text-lg font-bold tracking-tight">
              {mockVitrineSettings.displayName}
            </span>
          </Link>
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
