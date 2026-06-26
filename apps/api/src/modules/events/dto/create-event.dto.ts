import { IsObject, IsString } from "class-validator";

export class CreateEventDto {
  @IsString()
  organizationId!: string;

  @IsString()
  type!: string;

  @IsObject()
  payload!: Record<string, unknown>;
}
