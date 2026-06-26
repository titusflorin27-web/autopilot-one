import { BusinessDna } from "@autopilot/shared";
import { IsArray, IsObject, IsString } from "class-validator";

export class UpdateBusinessDnaDto {
  @IsString()
  organizationId!: string;

  @IsObject()
  businessDna!: BusinessDna;
}

export class BusinessDnaResponseDto {
  organizationId!: string;
  businessDna!: BusinessDna | null;
}

export function normalizeBusinessDna(input: BusinessDna): BusinessDna {
  return {
    summary: input.summary ?? "",
    products: Array.isArray(input.products) ? input.products : [],
    services: Array.isArray(input.services) ? input.services : [],
    rules: Array.isArray(input.rules) ? input.rules : [],
    tone: input.tone ?? "",
    faq: Array.isArray(input.faq) ? input.faq : [],
    objectives: Array.isArray(input.objectives) ? input.objectives : [],
  };
}

export class BusinessDnaShapeDto implements BusinessDna {
  @IsString()
  summary!: string;

  @IsArray()
  products!: BusinessDna["products"];

  @IsArray()
  services!: BusinessDna["services"];

  @IsArray()
  rules!: BusinessDna["rules"];

  @IsString()
  tone!: string;

  @IsArray()
  faq!: BusinessDna["faq"];

  @IsArray()
  objectives!: BusinessDna["objectives"];
}
