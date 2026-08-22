import Image from "next/image";
import { Source_Sans_3 } from "next/font/google";

const displayFont = Source_Sans_3({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
});

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${displayFont.variable} flex min-h-svh flex-col items-center justify-center gap-8 bg-slate-950 p-6`}
    >
      <div className="flex items-center gap-2.5">
        <Image
          src="/logo-mark.png"
          alt=""
          width={60}
          height={40}
          className="h-9 w-auto"
          priority
        />
        <span className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight text-white">
          NewVisionCar
        </span>
      </div>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
