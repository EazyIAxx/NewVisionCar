import Image from "next/image";
import { Source_Sans_3 } from "next/font/google";

import { BrandPanel } from "@/components/auth/brand-panel";

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
    <div className={`${displayFont.variable} grid min-h-svh md:grid-cols-2`}>
      <BrandPanel />
      <div className="flex items-center justify-center bg-background p-6 sm:p-10">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-2 md:hidden">
            <Image
              src="/logo-mark.png"
              alt=""
              width={60}
              height={40}
              className="h-8 w-auto"
              priority
            />
            <span className="font-[family-name:var(--font-display)] text-lg font-bold tracking-tight">
              Revenda<span className="text-primary">Pro</span>
            </span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
