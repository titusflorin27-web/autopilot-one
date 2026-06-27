import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { MembershipRole } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { HandleReceptionMessageDto } from "./dto/handle-message.dto";
import { HumanReplyDto } from "./dto/human-reply.dto";
import { UpdateConversationDto } from "./dto/update-conversation.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { ReceptionAiService } from "./reception-ai.service";

const MEMBER_ROLES = [MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER];

@Controller("reception-ai")
@UseGuards(JwtAuthGuard, RolesGuard)
export class ReceptionAiController {
  constructor(private readonly receptionAi: ReceptionAiService) {}

  @Get("organization/:organizationId/summary")
  @Roles(...MEMBER_ROLES)
  getOperationsSummary(@Param("organizationId") organizationId: string) {
    return this.receptionAi.getOperationsSummary(organizationId);
  }

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

  @Get("organization/:organizationId/leads")
  @Roles(...MEMBER_ROLES)
  listLeads(@Param("organizationId") organizationId: string) {
    return this.receptionAi.listLeads(organizationId);
  }

  @Post("message")
  @Roles(...MEMBER_ROLES)
  handleMessage(@Body() dto: HandleReceptionMessageDto) {
    return this.receptionAi.handleMessage(dto);
  }

  @Patch("conversations/:conversationId")
  @Roles(...MEMBER_ROLES)
  updateConversation(@Param("conversationId") conversationId: string, @Body() dto: UpdateConversationDto) {
    return this.receptionAi.updateConversation(conversationId, dto);
  }

  @Post("conversations/:conversationId/human-reply")
  @Roles(...MEMBER_ROLES)
  humanReply(@Param("conversationId") conversationId: string, @Body() dto: HumanReplyDto) {
    return this.receptionAi.humanReply(conversationId, dto);
  }

  @Patch("tasks/:taskId")
  @Roles(...MEMBER_ROLES)
  updateTask(@Param("taskId") taskId: string, @Body() dto: UpdateTaskDto) {
    return this.receptionAi.updateTask(taskId, dto);
  }

  @Patch("leads/:leadId")
  @Roles(...MEMBER_ROLES)
  updateLead(@Param("leadId") leadId: string, @Body() dto: UpdateLeadDto) {
    return this.receptionAi.updateLead(leadId, dto);
  }
}
