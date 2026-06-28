import { Body, Controller, Get, Headers, Ip, Param, Post } from "@nestjs/common";
import { RateLimit } from "../../common/security/rate-limit.decorator";
import { PublicReceptionMessageDto } from "./dto/public-reception-message.dto";
import { TrackWidgetEventDto } from "./dto/track-widget-event.dto";
import { ReceptionAiService } from "./reception-ai.service";

@Controller("public/reception-ai")
export class PublicReceptionController {
  constructor(private readonly receptionAi: ReceptionAiService) {}

  @Get("widget/:organizationSlug/config")
  @RateLimit({ name: "widget-config", limit: 120, windowSeconds: 60 })
  getPublicWidgetConfig(
    @Param("organizationSlug") organizationSlug: string,
    @Headers("origin") origin?: string,
    @Headers("user-agent") userAgent?: string,
    @Ip() ip?: string,
  ) {
    return this.receptionAi.getPublicWidgetConfig(organizationSlug, { origin, userAgent, ip });
  }

  @Post("widget/event")
  @RateLimit({ name: "widget-event", limit: 180, windowSeconds: 60 })
  trackWidgetEvent(
    @Body() dto: TrackWidgetEventDto,
    @Headers("origin") origin?: string,
    @Headers("user-agent") userAgent?: string,
    @Ip() ip?: string,
  ) {
    return this.receptionAi.trackWidgetEvent(dto, { origin, userAgent, ip });
  }

  @Post("message")
  @RateLimit({ name: "widget-message", limit: 20, windowSeconds: 60 })
  handlePublicMessage(
    @Body() dto: PublicReceptionMessageDto,
    @Headers("origin") origin?: string,
    @Headers("user-agent") userAgent?: string,
    @Ip() ip?: string,
  ) {
    return this.receptionAi.handlePublicMessage(dto, { origin, userAgent, ip });
  }
}
