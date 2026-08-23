import type { LucideIcon } from "lucide-react";
import {
  Car,
  LayoutDashboard,
  Kanban,
  Wallet,
  Trophy,
  Users,
} from "lucide-react";

export type Role = "gestor" | "vendedor";

export type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: Role[];
  comingSoon?: boolean;
};

export const navItems: NavItem[] = [
  {
    label: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
    roles: ["gestor", "vendedor"],
  },
  {
    label: "Estoque",
    href: "/estoque",
    icon: Car,
    roles: ["gestor", "vendedor"],
  },
  {
    label: "CRM",
    href: "/crm",
    icon: Kanban,
    roles: ["gestor", "vendedor"],
    comingSoon: true,
  },
  {
    label: "Financeiro",
    href: "/financeiro",
    icon: Wallet,
    roles: ["gestor"],
  },
  {
    label: "Desempenho",
    href: "/desempenho",
    icon: Trophy,
    roles: ["gestor"],
    comingSoon: true,
  },
  {
    label: "Equipe",
    href: "/settings/team",
    icon: Users,
    roles: ["gestor"],
  },
];
