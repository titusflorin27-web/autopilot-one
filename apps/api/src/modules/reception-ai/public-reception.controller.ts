import { Body, Controller, Post } from "@nestjs/common";
import { PublicReceptionMessageDto } from "./dto/public-reception-message.dto";
import { ReceptionAiService } from "./reception-ai.service";

@Controller("public/reception-ai")
export class PublicReceptionController {
  constructor(private readonly receptionAi: ReceptionAiService) {}

  @Post("message")
  handlePublicMessage(@Body() dto: PublicReceptionMessageDto) {
    return this.receptionAi.handlePublicMessage(dto);
  }
}
