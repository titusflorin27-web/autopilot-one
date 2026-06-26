import { IsInt, IsOptional, IsString, Max, Min, MinLength } from "class-validator";

export class SearchKnowledgeDto {
  @IsString()
  organizationId!: string;

  @IsString()
  @MinLength(2)
  query!: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(20)
  limit?: number;
}
