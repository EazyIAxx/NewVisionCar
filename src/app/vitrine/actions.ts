"use server";

export type ActionResult = { error: string | null };

type InterestInput = {
  vehicleId: string;
  name: string;
  email?: string;
  phone: string;
  message?: string;
};

// TODO(M12 backend): criar lead automaticamente no CRM (M4) com origem "site".
export async function sendInterest(input: InterestInput): Promise<ActionResult> {
  console.log("vitrine interest (mock)", input);
  return { error: null };
}
