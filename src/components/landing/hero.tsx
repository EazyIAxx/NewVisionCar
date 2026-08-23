import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import StickerPeel from "@/components/effects/StickerPeel";

export function Hero() {
  return (
    <section className="relative overflow-hidden px-6 pt-20 pb-24 sm:pt-28 sm:pb-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-[560px] bg-[radial-gradient(circle_at_50%_-10%,rgba(37,150,224,0.25),transparent_60%)]"
      />

      <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
        <span className="rounded-full border border-white/15 bg-white/5 px-4 py-1 text-xs font-medium text-slate-300">
          Gestão de revenda de veículos, tudo em um só lugar
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-white sm:text-5xl md:text-6xl">
          O sistema que sua revenda usa pra{" "}
          <span className="bg-gradient-to-r from-[#2596e0] to-[#56d3f2] bg-clip-text text-transparent">
            vender mais
          </span>{" "}
          e perder menos tempo
        </h1>

        <p className="mt-6 max-w-2xl text-lg text-slate-400">
          Estoque, CRM de leads, financeiro e comissão dos vendedores — sem
          depender de banco, marketplace ou planilha solta. Uma plataforma só,
          pensada pra revenda de veículos de passeio.
        </p>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <div className="relative inline-block">
            <div
              aria-hidden
              className="absolute inset-0 -z-10 rounded-lg bg-[#2596e0] opacity-40 blur-xl"
            />
            <Button
              size="lg"
              className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] px-6 text-white hover:brightness-110"
              render={<Link href="/signup" />}
              nativeButton={false}
            >
              Criar conta grátis
              <ArrowRight />
            </Button>
          </div>
          <Button
            size="lg"
            variant="outline"
            className="cursor-pointer border-white/15 bg-transparent px-6 text-slate-200 hover:bg-white/10 hover:text-white"
            render={<a href="#como-funciona" />}
            nativeButton={false}
          >
            Ver como funciona
          </Button>
        </div>

        <p className="mt-4 text-sm text-slate-500">
          Sem cartão de crédito. Leva menos de 2 minutos pra começar.
        </p>
      </div>

      <div className="pointer-events-none absolute right-[8%] top-24 hidden -rotate-6 lg:block">
        <div className="pointer-events-auto relative h-40 w-40">
          <StickerPeel
            imageSrc="/logo-mark.png"
            width={120}
            rotate={20}
            peelDirection={0}
          />
        </div>
      </div>
    </section>
  );
}
