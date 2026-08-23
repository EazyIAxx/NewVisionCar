"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { navItems, type Role } from "@/components/layout/nav-config";
import { signOut } from "@/app/(auth)/actions";

type AppSidebarProps = {
  role: Role;
  fullName: string;
  agencyName: string;
};

export function AppSidebar({ role, fullName, agencyName }: AppSidebarProps) {
  const pathname = usePathname();
  const items = navItems.filter((item) => item.roles.includes(role));
  const initials = fullName
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <div className="flex items-center gap-2 px-2 py-1">
          <Image
            src="/logo-mark.png"
            alt=""
            width={60}
            height={40}
            className="h-6 w-auto shrink-0"
          />
          <span className="truncate font-semibold group-data-[collapsible=icon]:hidden">
            {agencyName}
          </span>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    render={<Link href={item.comingSoon ? "#" : item.href} />}
                    isActive={pathname === item.href}
                    tooltip={item.label}
                    className="data-active:bg-gradient-to-r data-active:from-[#1b2a8f] data-active:via-[#2596e0] data-active:to-[#56d3f2] data-active:text-white"
                  >
                    <item.icon />
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                  {item.comingSoon && (
                    <SidebarMenuBadge>em breve</SidebarMenuBadge>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <DropdownMenu>
          <DropdownMenuTrigger
            className="flex w-full cursor-pointer items-center gap-2 rounded-lg px-2 py-1 outline-none hover:bg-sidebar-accent"
          >
            <Avatar className="size-8">
              <AvatarFallback>{initials || "?"}</AvatarFallback>
            </Avatar>
            <div className="min-w-0 group-data-[collapsible=icon]:hidden">
              <p className="truncate text-left text-sm font-medium">
                {fullName}
              </p>
              <p className="truncate text-left text-xs capitalize text-muted-foreground">
                {role}
              </p>
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="top">
            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              onClick={() => signOut()}
            >
              <LogOut />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
