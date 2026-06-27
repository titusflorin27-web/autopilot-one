import { IsOptional, IsString, MinLength } from "class-validator";

export class HumanReplyDto {
  @IsString()
  @MinLength(1)
  content!: string;

  @IsOptional()
  @IsString()
  internalNote?: string;
}
