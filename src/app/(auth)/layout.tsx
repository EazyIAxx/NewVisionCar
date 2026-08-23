import Image from "next/image";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-slate-950 p-6">
      <Link href="/" className="flex flex-col items-center gap-3">
        <Image
          src="/logo-mark.png"
          alt=""
          width={90}
          height={60}
          className="h-16 w-auto"
          priority
        />
        <span className="text-xl font-bold tracking-tight text-white">
          NewVisionCar
        </span>
      </Link>
      <div className="w-full max-w-sm">{children}</div>
    </div>
  );
}
