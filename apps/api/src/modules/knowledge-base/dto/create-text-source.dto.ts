import { IsOptional, IsString, MinLength } from "class-validator";

export class CreateTextSourceDto {
  @IsString()
  organizationId!: string;

  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  @MinLength(1)
  content!: string;

  @IsOptional()
  @IsString()
  fileName?: string;
}
