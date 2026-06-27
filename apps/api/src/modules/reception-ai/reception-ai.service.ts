import { Injectable, NotFoundException } from "@nestjs/common";
import { BusinessDna, KnowledgeSearchResult } from "@autopilot/shared";
import {
  ConversationStatus,
  KnowledgeSourceStatus,
  LeadStatus,
  MessageSender,
  Prisma,
  TaskPriority,
  TaskStatus,
} from "@prisma/client";
import { PrismaService } from "../../common/prisma.service";
import { HandleReceptionMessageDto } from "./dto/handle-message.dto";
import { HumanReplyDto } from "./dto/human-reply.dto";
import { UpdateConversationDto } from "./dto/update-conversation.dto";
import { UpdateLeadDto } from "./dto/update-lead.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";

const DEFAULT_CONFIDENCE = 0.72;
const ESCALATION_CONFIDENCE_THRESHOLD = 0.45;

@Injectable()
export class ReceptionAiService {
  constructor(private readonly prisma: PrismaService) {}

  listConversations(organizationId: string) {
    return this.prisma.receptionConversation.findMany({
      where: { organizationId },
      include: {
        lead: true,
        messages: {
          orderBy: { createdAt: "asc" },
          take: 10,
        },
      },
      orderBy: { updatedAt: "desc" },
    });
  }

  listTasks(organizationId: string) {
    return this.prisma.task.findMany({
      where: { organizationId },
      orderBy: [{ status: "asc" }, { priority: "desc" }, { createdAt: "desc" }],
    });
  }

  listLeads(organizationId: string) {
    return this.prisma.lead.findMany({
      where: { organizationId },
      include: {
        conversations: {
          select: { id: true, status: true, updatedAt: true },
          orderBy: { updatedAt: "desc" },
          take: 3,
        },
      },
      orderBy: [{ score: "desc" }, { updatedAt: "desc" }],
    });
  }

  async getOperationsSummary(organizationId: string) {
    const [conversationGroups, taskGroups, leadGroups] = await Promise.all([
      this.prisma.receptionConversation.groupBy({
        by: ["status"],
        where: { organizationId },
        _count: { _all: true },
      }),
      this.prisma.task.groupBy({
        by: ["status"],
        where: { organizationId },
        _count: { _all: true },
      }),
      this.prisma.lead.groupBy({
        by: ["status"],
        where: { organizationId },
        _count: { _all: true },
      }),
    ]);

    return {
      conversations: this.countByStatus(conversationGroups),
      tasks: this.countByStatus(taskGroups),
      leads: this.countByStatus(leadGroups),
    };
  }

  async updateConversation(conversationId: string, dto: UpdateConversationDto) {
    const data: Prisma.ReceptionConversationUpdateInput = {
      status: dto.status,
      escalationReason: dto.escalationReason,
      internalNote: dto.internalNote,
    };

    if (dto.status) {
      data.closedAt = dto.status === ConversationStatus.CLOSED ? new Date() : null;
    }

    const conversation = await this.prisma.receptionConversation.update({
      where: { id: conversationId },
      data,
      include: { lead: true, messages: { orderBy: { createdAt: "asc" }, take: 10 } },
    });

    await this.prisma.event.create({
      data: {
        organizationId: conversation.organizationId,
        type: "reception_ai.conversation_updated",
        payload: {
          conversationId,
          status: dto.status,
          escalationReason: dto.escalationReason,
        } as Prisma.InputJsonValue,
      },
    });

    return conversation;
  }

  async humanReply(conversationId: string, dto: HumanReplyDto) {
    return this.prisma.$transaction(async (tx) => {
      const conversation = await tx.receptionConversation.findUnique({
        where: { id: conversationId },
        select: { id: true, organizationId: true },
      });

      if (!conversation) {
        throw new NotFoundException("Conversation not found");
      }

      const message = await tx.receptionMessage.create({
        data: {
          conversationId,
          sender: MessageSender.HUMAN,
          content: dto.content,
        },
      });

      const updatedConversation = await tx.receptionConversation.update({
        where: { id: conversationId },
        data: {
          status: ConversationStatus.OPEN,
          internalNote: dto.internalNote,
          closedAt: null,
        },
        include: { lead: true, messages: { orderBy: { createdAt: "asc" }, take: 10 } },
      });

      await tx.event.create({
        data: {
          organizationId: conversation.organizationId,
          type: "reception_ai.human_reply_added",
          payload: {
            conversationId,
            messageId: message.id,
          } as Prisma.InputJsonValue,
        },
      });

      return updatedConversation;
    });
  }

  async updateTask(taskId: string, dto: UpdateTaskDto) {
    const data: Prisma.TaskUpdateInput = {
      status: dto.status,
      priority: dto.priority,
      ownerNote: dto.ownerNote,
    };

    if (dto.status) {
      data.completedAt = dto.status === TaskStatus.DONE ? new Date() : null;
    }

    const task = await this.prisma.task.update({
      where: { id: taskId },
      data,
    });

    await this.prisma.event.create({
      data: {
        organizationId: task.organizationId,
        type: "reception_ai.task_updated",
        payload: {
          taskId,
          status: dto.status,
          priority: dto.priority,
        } as Prisma.InputJsonValue,
      },
    });

    return task;
  }

  async updateLead(leadId: string, dto: UpdateLeadDto) {
    const data: Prisma.LeadUpdateInput = {
      status: dto.status,
      score: dto.score,
      ownerNote: dto.ownerNote,
      summary: dto.summary,
    };

    if (dto.ownerNote || dto.status === LeadStatus.QUALIFIED || dto.status === LeadStatus.CONVERTED) {
      data.lastContactedAt = new Date();
    }

    const lead = await this.prisma.lead.update({
      where: { id: leadId },
      data,
      include: {
        conversations: {
          select: { id: true, status: true, updatedAt: true },
          orderBy: { updatedAt: "desc" },
          take: 3,
        },
      },
    });

    await this.prisma.event.create({
      data: {
        organizationId: lead.organizationId,
        type: "reception_ai.lead_updated",
        payload: {
          leadId,
          status: dto.status,
          score: dto.score,
        } as Prisma.InputJsonValue,
      },
    });

    return lead;
  }

  async handleMessage(dto: HandleReceptionMessageDto) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: dto.organizationId },
      select: {
        id: true,
        name: true,
        businessDna: true,
      },
    });

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    const businessDna = organization.businessDna as unknown as BusinessDna | null;
    const citations = await this.findRelevantKnowledge(dto.organizationId, dto.message);
    const leadScore = this.scoreLead(dto.message);
    const shouldCreateLead = leadScore >= 45 || Boolean(dto.customerEmail);
    const confidence = this.calculateConfidence(dto.message, businessDna, citations);
    const shouldEscalate = confidence < ESCALATION_CONFIDENCE_THRESHOLD || this.needsHuman(dto.message);
    const escalationReason = shouldEscalate ? this.getEscalationReason(dto.message, confidence) : undefined;
    const reply = this.composeReply({
      organizationName: organization.name,
      message: dto.message,
      businessDna,
      citations,
      leadScore,
      shouldEscalate,
    });

    return this.prisma.$transaction(async (tx) => {
      const conversation = dto.conversationId
        ? await tx.receptionConversation.update({
            where: { id: dto.conversationId },
            data: {
              customerName: dto.customerName,
              customerEmail: dto.customerEmail,
              status: shouldEscalate ? ConversationStatus.WAITING_FOR_HUMAN : ConversationStatus.OPEN,
              escalationReason,
              closedAt: null,
            },
          })
        : await tx.receptionConversation.create({
            data: {
              organizationId: dto.organizationId,
              customerName: dto.customerName,
              customerEmail: dto.customerEmail,
              channel: dto.channel ?? "web",
              status: shouldEscalate ? ConversationStatus.WAITING_FOR_HUMAN : ConversationStatus.OPEN,
              escalationReason,
            },
          });

      await tx.receptionMessage.create({
        data: {
          conversationId: conversation.id,
          sender: MessageSender.CUSTOMER,
          content: dto.message,
        },
      });

      let leadId: string | null = conversation.leadId ?? null;
      let taskId: string | null = null;

      if (shouldCreateLead && !leadId) {
        const lead = await tx.lead.create({
          data: {
            organizationId: dto.organizationId,
            name: dto.customerName,
            email: dto.customerEmail,
            summary: this.summarizeLead(dto.message, leadScore),
            score: leadScore,
            status: leadScore >= 70 ? LeadStatus.QUALIFIED : LeadStatus.NEW,
          },
        });
        leadId = lead.id;

        await tx.receptionConversation.update({
          where: { id: conversation.id },
          data: { leadId },
        });
      }

      if (shouldCreateLead || shouldEscalate) {
        const task = await tx.task.create({
          data: {
            organizationId: dto.organizationId,
            title: shouldEscalate ? "Review Reception AI conversation" : "Follow up with new lead",
            description: this.composeTaskDescription(dto.message, reply, leadScore, shouldEscalate),
            priority: shouldEscalate || leadScore >= 70 ? TaskPriority.HIGH : TaskPriority.MEDIUM,
            ownerNote: escalationReason,
          },
        });
        taskId = task.id;
      }

      await tx.receptionMessage.create({
        data: {
          conversationId: conversation.id,
          sender: MessageSender.AI,
          content: reply,
          metadata: {
            confidence,
            shouldEscalate,
            escalationReason,
            leadScore,
            citations: citations.map((citation) => ({
              sourceId: citation.sourceId,
              chunkId: citation.chunkId,
              score: citation.score,
            })),
          } as Prisma.InputJsonValue,
        },
      });

      await tx.event.create({
        data: {
          organizationId: dto.organizationId,
          type: "reception_ai.message_handled",
          payload: {
            conversationId: conversation.id,
            leadId,
            taskId,
            confidence,
            shouldEscalate,
            escalationReason,
          } as Prisma.InputJsonValue,
        },
      });

      return {
        conversationId: conversation.id,
        reply,
        confidence,
        shouldEscalate,
        escalationReason,
        leadId,
        taskId,
        citations,
      };
    });
  }

  private async findRelevantKnowledge(organizationId: string, query: string): Promise<KnowledgeSearchResult[]> {
    const queryTokens = this.tokenize(query);

    if (!queryTokens.length) {
      return [];
    }

    const chunks = await this.prisma.knowledgeChunk.findMany({
      where: {
        organizationId,
        source: { status: KnowledgeSourceStatus.INDEXED },
      },
      include: {
        source: {
          select: { id: true, title: true, type: true },
        },
      },
      take: 100,
      orderBy: { createdAt: "desc" },
    });

    return chunks
      .map((chunk) => ({
        chunkId: chunk.id,
        sourceId: chunk.source.id,
        sourceTitle: chunk.source.title,
        sourceType: chunk.source.type,
        content: chunk.content,
        score: this.scoreChunk(query, queryTokens, chunk.content),
      }))
      .filter((result) => result.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }

  private composeReply(input: {
    organizationName: string;
    message: string;
    businessDna: BusinessDna | null;
    citations: KnowledgeSearchResult[];
    leadScore: number;
    shouldEscalate: boolean;
  }): string {
    const tone = input.businessDna?.tone || "professional, helpful and concise";
    const summary = input.businessDna?.summary || `${input.organizationName} can help with your request.`;
    const bestKnowledge = input.citations[0]?.content;
    const service = input.businessDna?.services?.[0]?.title || input.businessDna?.products?.[0]?.title;

    const lines = [
      `Thanks for reaching out to ${input.organizationName}.`,
      `Based on our company context, ${summary}`,
    ];

    if (bestKnowledge) {
      lines.push(`Relevant information: ${this.truncate(bestKnowledge, 420)}`);
    } else if (service) {
      lines.push(`A good next step is to look at ${service} and confirm what outcome you want.`);
    }

    if (input.leadScore >= 70) {
      lines.push("This looks like a strong fit. I can help route this to the team for follow-up.");
    } else if (input.leadScore >= 45) {
      lines.push("I can collect a few more details and make sure the right person follows up.");
    }

    if (input.shouldEscalate) {
      lines.push("I am also flagging this for a human review so we do not give you an incomplete answer.");
    }

    lines.push(`Tone target: ${tone}.`);

    return lines.join(" ");
  }

  private calculateConfidence(message: string, businessDna: BusinessDna | null, citations: KnowledgeSearchResult[]): number {
    let confidence = DEFAULT_CONFIDENCE;

    if (!businessDna?.summary) {
      confidence -= 0.18;
    }

    if (!citations.length) {
      confidence -= 0.16;
    }

    if (this.needsHuman(message)) {
      confidence -= 0.2;
    }

    return Math.max(0.1, Math.min(0.98, Number(confidence.toFixed(2))));
  }

  private getEscalationReason(message: string, confidence: number): string {
    if (confidence < ESCALATION_CONFIDENCE_THRESHOLD) {
      return `Low confidence response (${Math.round(confidence * 100)}%).`;
    }

    const lowerMessage = message.toLowerCase();
    const matchedSignal = ["refund", "legal", "lawsuit", "angry", "complaint", "cancel", "human", "manager"].find((signal) =>
      lowerMessage.includes(signal),
    );

    return matchedSignal ? `Human review signal detected: ${matchedSignal}.` : "Human review requested.";
  }

  private scoreLead(message: string): number {
    const tokens = this.tokenize(message);
    const strongSignals = ["price", "pricing", "quote", "demo", "buy", "purchase", "contract", "urgent", "meeting", "call", "consultation"];
    const mediumSignals = ["interested", "need", "looking", "help", "service", "solution", "proposal"];
    let score = 20;

    score += strongSignals.filter((signal) => tokens.includes(signal)).length * 14;
    score += mediumSignals.filter((signal) => tokens.includes(signal)).length * 8;

    if (message.includes("@")) {
      score += 18;
    }

    return Math.min(100, score);
  }

  private needsHuman(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return ["refund", "legal", "lawsuit", "angry", "complaint", "cancel", "human", "manager"].some((signal) => lowerMessage.includes(signal));
  }

  private composeTaskDescription(message: string, reply: string, leadScore: number, shouldEscalate: boolean): string {
    return [
      `Customer message: ${message}`,
      `Reception AI reply: ${reply}`,
      `Lead score: ${leadScore}`,
      `Escalation required: ${shouldEscalate ? "yes" : "no"}`,
    ].join("\n\n");
  }

  private summarizeLead(message: string, leadScore: number): string {
    return `Reception AI detected a potential lead with score ${leadScore}. Original message: ${this.truncate(message, 360)}`;
  }

  private scoreChunk(query: string, queryTokens: string[], content: string): number {
    const contentTokens = new Set(this.tokenize(content));
    const matches = queryTokens.filter((token) => contentTokens.has(token)).length;
    const phraseBonus = content.toLowerCase().includes(query.toLowerCase()) ? 2 : 0;

    return matches / queryTokens.length + phraseBonus;
  }

  private tokenize(value: string): string[] {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .split(/[^a-z0-9]+/)
      .filter((token) => token.length > 2);
  }

  private truncate(value: string, maxLength: number): string {
    return value.length > maxLength ? `${value.slice(0, maxLength).trim()}...` : value;
  }

  private countByStatus<T extends { _count: { _all: number } }>(groups: Array<T & Record<string, unknown>>) {
    return groups.reduce<Record<string, number>>((accumulator, group) => {
      const [status] = Object.entries(group).find(([key]) => key !== "_count") ?? ["unknown", "unknown"];
      accumulator[String(group[status])] = group._count._all;
      return accumulator;
    }, {});
  }
}
