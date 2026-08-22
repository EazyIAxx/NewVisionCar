"use client";

import { useState } from "react";
import { Copy, Plus } from "lucide-react";
import { toast } from "sonner";

import { generateInviteCode } from "@/app/(dashboard)/settings/team/actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export type Member = {
  id: string;
  full_name: string | null;
  email: string | null;
  role: "gestor" | "vendedor" | null;
};

export function TeamPanel({ initialMembers }: { initialMembers: Member[] }) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [inviteCode, setInviteCode] = useState<string | null>(null);

  async function handleGenerateInvite() {
    setIsGenerating(true);
    const result = await generateInviteCode();
    if (result.error) {
      toast.error(result.error);
    } else {
      setInviteCode(result.code);
      toast.success("Código de convite gerado");
    }
    setIsGenerating(false);
  }

  function handleCopy() {
    if (!inviteCode) return;
    navigator.clipboard.writeText(inviteCode);
    toast.success("Código copiado");
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Membros da equipe</CardTitle>
          <CardDescription>
            Gestores e vendedores com acesso a esta revenda.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {initialMembers.map((member, index) => (
            <div key={member.id}>
              {index > 0 && <Separator className="mb-3" />}
              <div className="flex items-center gap-3">
                <Avatar className="size-9">
                  <AvatarFallback>
                    {(member.full_name ?? member.email ?? "??")
                      .slice(0, 2)
                      .toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">
                    {member.full_name ?? "Sem nome"}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {member.email}
                  </p>
                </div>
                <Badge variant="secondary" className="capitalize">
                  {member.role ?? "pendente"}
                </Badge>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Convidar vendedor</CardTitle>
          <CardDescription>
            Gere um código de convite para um novo vendedor entrar na
            revenda.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Button
            onClick={handleGenerateInvite}
            disabled={isGenerating}
            className="w-fit"
          >
            <Plus />
            {isGenerating ? "Gerando..." : "Gerar código de convite"}
          </Button>
          {inviteCode && (
            <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2">
              <code className="flex-1 text-sm font-medium tracking-widest">
                {inviteCode}
              </code>
              <Button variant="ghost" size="icon" onClick={handleCopy}>
                <Copy />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
