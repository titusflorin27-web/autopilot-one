import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { MembershipRole } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { HandleReceptionMessageDto } from "./dto/handle-message.dto";
import { ReceptionAiService } from "./reception-ai.service";

const MEMBER_ROLES = [MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER];

@Controller("reception-ai")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReceptionAiController {
  constructor(private readonly receptionAi: ReceptionAiService) {}

  @Get("organization/:organizationId/conversations")
  @Roles(...MEMBER_ROLES)
  listConversations(@Param("organizationId") organizationId: string) {
    return this.receptionAi.listConversations(organizationId);
  }

  @Get("organization/:organizationId/tasks")
  @Roles(...MEMBER_ROLES)
  listTasks(@Param("organizationId") organizationId: string) {
    return this.receptionAi.listTasks(organizationId);
  }

  @Post("message")
  @Roles(...MEMBER_ROLES)
  handleMessage(@Body() dto: HandleReceptionMessageDto) {
    return this.receptionAi.handleMessage(dto);
  }
}
