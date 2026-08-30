import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/layout/sidebar";
import { Topbar } from "@/components/layout/topbar";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getCurrentProfile();

  if (!profile) {
    redirect("/login");
  }

  if (!profile.agency_id || !profile.role) {
    redirect("/onboarding");
  }

  const supabase = await createClient();
  const { data: agency } = await supabase
    .from("agencies")
    .select("name, plan_status")
    .eq("id", profile.agency_id)
    .single();

  // Bloqueia o resto do dashboard se a assinatura estiver inadimplente ou
  // cancelada — /settings/billing continua acessível pra dar pra reassinar.
  const pathname = (await headers()).get("x-pathname") ?? "";
  const isBillingBlocked =
    agency?.plan_status === "past_due" || agency?.plan_status === "canceled";
  if (isBillingBlocked && pathname !== "/settings/billing") {
    redirect("/settings/billing");
  }

  return (
    <SidebarProvider>
      <AppSidebar
        role={profile.role}
        fullName={profile.full_name ?? profile.email ?? "Usuário"}
        agencyName={agency?.name ?? "Minha Revenda"}
      />
      <SidebarInset>
        <Topbar title="NewVisionCar" />
        <div className="flex min-w-0 flex-1 flex-col gap-4 p-4">{children}</div>
      </SidebarInset>
    </SidebarProvider>
  );
}
