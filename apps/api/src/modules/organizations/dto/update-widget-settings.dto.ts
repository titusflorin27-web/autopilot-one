import { WidgetPosition } from "@prisma/client";
import { IsArray, IsBoolean, IsEnum, IsOptional, IsString, Matches, MaxLength } from "class-validator";

export class UpdateWidgetSettingsDto {
  @IsOptional()
  @IsBoolean()
  widgetEnabled?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  widgetTitle?: string;

  @IsOptional()
  @IsString()
  @Matches(/^#[0-9A-Fa-f]{6}$/)
  widgetPrimaryColor?: string;

  @IsOptional()
  @IsEnum(WidgetPosition)
  widgetPosition?: WidgetPosition;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  widgetToken?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  widgetAllowedOrigins?: string[];
}
