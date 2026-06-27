import { Controller, Get, Param, Query, UseGuards } from "@nestjs/common";
import { ConversationStatus, MembershipRole } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { InboxService } from "./inbox.service";

@Controller("inbox")
@UseGuards(JwtAuthGuard, RolesGuard)
export class InboxController {
  constructor(private readonly inbox: InboxService) {}

  @Get("organization/:organizationId/conversations")
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER)
  listConversations(
    @Param("organizationId") organizationId: string,
    @Query("status") status?: ConversationStatus,
    @Query("source") source?: string,
  ) {
    return this.inbox.listConversations(organizationId, status, source);
  }

  @Get("organization/:organizationId/conversations/:conversationId")
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER)
  getConversation(@Param("organizationId") organizationId: string, @Param("conversationId") conversationId: string) {
    return this.inbox.getConversation(organizationId, conversationId);
  }
}
