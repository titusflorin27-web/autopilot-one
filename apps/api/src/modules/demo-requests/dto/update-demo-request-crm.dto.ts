import { IsISO8601, IsOptional, IsString, MaxLength } from "class-validator";

export class UpdateDemoRequestCrmDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  internalNote?: string | null;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  nextStep?: string | null;

  @IsOptional()
  @IsISO8601()
  followUpAt?: string | null;
}
