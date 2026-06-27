import { WidgetEventType } from "@prisma/client";
import { IsEnum, IsObject, IsOptional, IsString, MaxLength } from "class-validator";

export class TrackWidgetEventDto {
  @IsString()
  @MaxLength(80)
  organizationSlug!: string;

  @IsEnum(WidgetEventType)
  type!: WidgetEventType;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  visitorId?: string;

  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  websiteUrl?: string;

  @IsOptional()
  @IsObject()
  metadata?: Record<string, unknown>;
}
