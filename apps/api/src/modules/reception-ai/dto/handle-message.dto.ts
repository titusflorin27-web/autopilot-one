import { IsEmail, IsOptional, IsString, MinLength } from "class-validator";

export class HandleReceptionMessageDto {
  @IsString()
  organizationId!: string;

  @IsString()
  @MinLength(2)
  message!: string;

  @IsOptional()
  @IsString()
  conversationId?: string;

  @IsOptional()
  @IsString()
  customerName?: string;

  @IsOptional()
  @IsEmail()
  customerEmail?: string;

  @IsOptional()
  @IsString()
  channel?: string;
}
