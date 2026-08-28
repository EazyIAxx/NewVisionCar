"use server";

import { createClient } from "@/lib/supabase/server";
import { getCurrentProfile } from "@/lib/auth/get-profile";
import type { LeadOrigin, LeadStage, LeadActivityType } from "@/lib/types/lead";

export type ActionResult = { error: string | null };

// Vendedor mexendo num lead sem dono "pega" ele automaticamente. Gestor não
// assume o lead ao só mudar estágio/adicionar nota (ele não é vendedor).
async function claimLeadIfUnassigned(
  supabase: Awaited<ReturnType<typeof createClient>>,
  leadId: string,
  profile: { id: string; role: string | null },
) {
  if (profile.role !== "vendedor") return;
  await supabase
    .from("leads")
    .update({ vendedor_id: profile.id })
    .eq("id", leadId)
    .is("vendedor_id", null);
}

export async function updateLeadStage(
  leadId: string,
  stage: LeadStage,
): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Sessão inválida." };

  const supabase = await createClient();
  await claimLeadIfUnassigned(supabase, leadId, profile);

  const { error } = await supabase.from("leads").update({ stage }).eq("id", leadId);
  return { error: error?.message ?? null };
}

type LeadInput = {
  name: string;
  phone: string;
  email?: string;
  origin: LeadOrigin;
  vehicleInterest?: string;
  vendedorId?: string;
};

export async function createLead(input: LeadInput): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Sessão inválida." };

  const supabase = await createClient();
  const { error } = await supabase.from("leads").insert({
    agency_id: profile.agency_id,
    vendedor_id: input.vendedorId || null,
    name: input.name,
    phone: input.phone,
    email: input.email || null,
    origin: input.origin,
    vehicle_interest: input.vehicleInterest || null,
  });

  return { error: error?.message ?? null };
}

export async function scheduleVisit(
  leadId: string,
  visitDate: string | null,
): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Sessão inválida." };

  const supabase = await createClient();
  await claimLeadIfUnassigned(supabase, leadId, profile);

  const { error } = await supabase
    .from("leads")
    .update({
      visit_date: visitDate,
      // Definir uma data agenda a visita de verdade; limpar a data não força
      // o estágio de volta (usuário pode ter cancelado só o horário e
      // continuar negociando).
      ...(visitDate ? { stage: "visita_agendada" } : {}),
    })
    .eq("id", leadId);

  return { error: error?.message ?? null };
}

type ActivityInput = {
  type: LeadActivityType;
  description: string;
};

export async function addLeadActivity(
  leadId: string,
  input: ActivityInput,
): Promise<ActionResult> {
  const profile = await getCurrentProfile();
  if (!profile?.agency_id) return { error: "Sessão inválida." };

  const supabase = await createClient();
  await claimLeadIfUnassigned(supabase, leadId, profile);

  const { error } = await supabase.from("lead_activities").insert({
    agency_id: profile.agency_id,
    lead_id: leadId,
    type: input.type,
    description: input.description,
  });

  return { error: error?.message ?? null };
}
