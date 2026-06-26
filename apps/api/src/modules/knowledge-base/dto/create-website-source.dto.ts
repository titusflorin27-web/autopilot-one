import { IsOptional, IsString, IsUrl, MinLength } from "class-validator";

export class CreateWebsiteSourceDto {
  @IsString()
  organizationId!: string;

  @IsUrl({ require_protocol: true })
  url!: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;
}
