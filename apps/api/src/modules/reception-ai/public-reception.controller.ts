import { Body, Controller, Get, Headers, Ip, Param, Post } from "@nestjs/common";
import { PublicReceptionMessageDto } from "./dto/public-reception-message.dto";
import { ReceptionAiService } from "./reception-ai.service";

@Controller("public/reception-ai")
export class PublicReceptionController {
  constructor(private readonly receptionAi: ReceptionAiService) {}

  @Get("widget/:organizationSlug/config")
  getPublicWidgetConfig(
    @Param("organizationSlug") organizationSlug: string,
    @Headers("origin") origin?: string,
    @Headers("user-agent") userAgent?: string,
    @Ip() ip?: string,
  ) {
    return this.receptionAi.getPublicWidgetConfig(organizationSlug, { origin, userAgent, ip });
  }

  @Post("message")
  handlePublicMessage(
    @Body() dto: PublicReceptionMessageDto,
    @Headers("origin") origin?: string,
    @Headers("user-agent") userAgent?: string,
    @Ip() ip?: string,
  ) {
    return this.receptionAi.handlePublicMessage(dto, { origin, userAgent, ip });
  }
}
