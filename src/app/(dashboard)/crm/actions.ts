"use server";

import type { LeadOrigin, LeadStage, LeadActivityType } from "@/lib/types/lead";

export type ActionResult = { error: string | null };

// TODO(M4 backend): substituir por update real na tabela `leads` (RLS: vendedor só o próprio lead).
export async function updateLeadStage(
  leadId: string,
  stage: LeadStage,
): Promise<ActionResult> {
  console.log("update lead stage (mock)", leadId, stage);
  return { error: null };
}

type LeadInput = {
  name: string;
  phone: string;
  email?: string;
  origin: LeadOrigin;
  vehicleInterest?: string;
};

// TODO(M4 backend): substituir por insert real na tabela `leads`.
export async function createLead(input: LeadInput): Promise<ActionResult> {
  console.log("create lead (mock)", input);
  return { error: null };
}

type ActivityInput = {
  type: LeadActivityType;
  description: string;
};

// TODO(M4 backend): substituir por insert real na tabela `lead_activities`.
export async function addLeadActivity(
  leadId: string,
  input: ActivityInput,
): Promise<ActionResult> {
  console.log("add lead activity (mock)", leadId, input);
  return { error: null };
}
