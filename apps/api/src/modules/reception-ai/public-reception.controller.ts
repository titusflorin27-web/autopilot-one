import { Body, Controller, Headers, Ip, Post } from "@nestjs/common";
import { PublicReceptionMessageDto } from "./dto/public-reception-message.dto";
import { ReceptionAiService } from "./reception-ai.service";

@Controller("public/reception-ai")
export class PublicReceptionController {
  constructor(private readonly receptionAi: ReceptionAiService) {}

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
