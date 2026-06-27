import { IsEmail, IsOptional, IsString, IsUrl, MaxLength, MinLength } from "class-validator";

export class PublicReceptionMessageDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  organizationSlug!: string;

  @IsString()
  @MinLength(2)
  @MaxLength(2000)
  message!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  customerName?: string;

  @IsOptional()
  @IsEmail()
  @MaxLength(200)
  customerEmail?: string;

  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  visitorId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  widgetToken?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true })
  websiteUrl?: string;
}
