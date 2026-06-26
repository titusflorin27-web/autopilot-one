import { IsObject, IsString } from "class-validator";

export class UpdateBusinessDnaDto {
  @IsString()
  organizationId!: string;

  @IsObject()
  businessDna!: Record<string, unknown>;
}
