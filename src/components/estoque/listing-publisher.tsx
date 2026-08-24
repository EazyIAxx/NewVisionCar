"use client";

import { useState } from "react";
import { Megaphone } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  listingPortalLabel,
  listingPortals,
  listingStatusLabel,
  type ListingPortal,
  type ListingStatus,
} from "@/lib/types/listing";
import { publishListing, unpublishListing } from "@/app/(dashboard)/estoque/actions";

const statusClassName: Record<ListingStatus, string> = {
  publicado: "bg-status-available/15 text-status-available",
  nao_publicado: "bg-muted text-muted-foreground",
  erro: "bg-status-lost/15 text-status-lost",
};

export function ListingPublisher({ vehicleId }: { vehicleId: string }) {
  const [statuses, setStatuses] = useState<Record<ListingPortal, ListingStatus>>({
    olx: "nao_publicado",
    webmotors: "nao_publicado",
  });
  const [loadingPortal, setLoadingPortal] = useState<ListingPortal | null>(null);

  async function handlePublish(portal: ListingPortal) {
    setLoadingPortal(portal);
    const result = await publishListing(vehicleId, portal);
    if (result?.error) {
      toast.error(result.error);
      setStatuses((prev) => ({ ...prev, [portal]: "erro" }));
    } else {
      toast.success(`Anúncio publicado na ${listingPortalLabel[portal]}`);
      setStatuses((prev) => ({ ...prev, [portal]: "publicado" }));
    }
    setLoadingPortal(null);
  }

  async function handleUnpublish(portal: ListingPortal) {
    setLoadingPortal(portal);
    const result = await unpublishListing(vehicleId, portal);
    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success(`Anúncio removido da ${listingPortalLabel[portal]}`);
      setStatuses((prev) => ({ ...prev, [portal]: "nao_publicado" }));
    }
    setLoadingPortal(null);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5">
          <Megaphone className="size-4" /> Anúncios
        </CardTitle>
        <CardDescription>
          Publique este veículo direto nos portais parceiros.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3">
        {listingPortals.map((portal) => {
          const status = statuses[portal];
          const isLoading = loadingPortal === portal;
          return (
            <div
              key={portal}
              className="flex items-center justify-between rounded-lg border p-3"
            >
              <div className="flex items-center gap-3">
                <span className="font-medium">{listingPortalLabel[portal]}</span>
                <span
                  className={cn(
                    "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
                    statusClassName[status],
                  )}
                >
                  {listingStatusLabel[status]}
                </span>
              </div>
              {status === "publicado" ? (
                <Button
                  size="sm"
                  variant="outline"
                  className="cursor-pointer"
                  disabled={isLoading}
                  onClick={() => handleUnpublish(portal)}
                >
                  {isLoading ? "Removendo..." : "Remover anúncio"}
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="cursor-pointer bg-gradient-to-r from-[#1b2a8f] via-[#2596e0] to-[#56d3f2] text-white hover:brightness-110"
                  disabled={isLoading}
                  onClick={() => handlePublish(portal)}
                >
                  {isLoading ? "Publicando..." : "Publicar anúncio"}
                </Button>
              )}
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
