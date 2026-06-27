import { Injectable, NotFoundException } from "@nestjs/common";
import { ConversationStatus } from "@prisma/client";
import { PrismaService } from "../../common/prisma.service";

@Injectable()
export class InboxService {
  constructor(private readonly prisma: PrismaService) {}

  async listConversations(organizationId: string, status?: ConversationStatus, source?: string) {
    return this.prisma.receptionConversation.findMany({
      where: {
        organizationId,
        status,
        channel: source ? { startsWith: source } : undefined,
      },
      select: {
        id: true,
        customerName: true,
        customerEmail: true,
        channel: true,
        status: true,
        escalationReason: true,
        internalNote: true,
        closedAt: true,
        createdAt: true,
        updatedAt: true,
        lead: {
          select: {
            id: true,
            score: true,
            status: true,
            summary: true,
          },
        },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1,
          select: {
            id: true,
            sender: true,
            content: true,
            createdAt: true,
          },
        },
      },
      orderBy: [{ status: "asc" }, { updatedAt: "desc" }],
      take: 100,
    });
  }

  async getConversation(organizationId: string, conversationId: string) {
    const conversation = await this.prisma.receptionConversation.findFirst({
      where: { id: conversationId, organizationId },
      include: {
        lead: true,
        messages: {
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!conversation) {
      throw new NotFoundException("Conversation not found");
    }

    return conversation;
  }
}
