import type { BusinessEvent } from "@autopilot/shared";

export type BusinessDna = {
  companyName: string;
  industry: string;
  website?: string;
  language: string;
  country?: string;
  toneOfVoice: "formal" | "friendly" | "premium" | "direct";
  products: string[];
  services: string[];
  faq: Array<{ question: string; answer: string }>;
  rules: string[];
};

export function createEvent<TPayload>(
  organizationId: string,
  type: string,
  payload: TPayload,
): Omit<BusinessEvent<TPayload>, "id" | "createdAt"> {
  return {
    organizationId,
    type,
    payload,
    status: "pending",
  };
}

export function validateBusinessDna(dna: BusinessDna): string[] {
  const errors: string[] = [];
  if (!dna.companyName) errors.push("companyName is required");
  if (!dna.industry) errors.push("industry is required");
  if (!dna.language) errors.push("language is required");
  return errors;
}
