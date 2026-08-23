import Image from "next/image";
import Link from "next/link";

export function LandingFooter() {
  return (
    <footer className="border-t border-white/10 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
        <div className="flex items-center gap-2">
          <Image
            src="/logo-mark.png"
            alt=""
            width={24}
            height={16}
            className="h-5 w-auto"
          />
          <span className="text-sm font-semibold text-white">
            NewVisionCar
          </span>
        </div>

        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} NewVisionCar. Todos os direitos reservados.
        </p>

        <div className="flex items-center gap-4 text-sm text-slate-400">
          <Link href="/login" className="hover:text-white">
            Entrar
          </Link>
          <Link href="/signup" className="hover:text-white">
            Criar conta
          </Link>
        </div>
      </div>
    </footer>
  );
}
