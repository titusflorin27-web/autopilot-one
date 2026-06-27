import { Injectable } from "@nestjs/common";
import { ConversationStatus, LeadStatus, TaskPriority, TaskStatus } from "@prisma/client";
import { PrismaService } from "../../common/prisma.service";

type NotificationPriority = "LOW" | "MEDIUM" | "HIGH";

type NotificationItem = {
  id: string;
  type: "HUMAN_HANDOFF" | "HIGH_SCORE_LEAD" | "HIGH_PRIORITY_TASK";
  priority: NotificationPriority;
  title: string;
  description: string;
  href: string;
  createdAt: Date;
};

@Injectable()
export class NotificationsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(organizationId: string) {
    const [handoffs, leads, tasks] = await Promise.all([
      this.prisma.receptionConversation.findMany({
        where: { organizationId, status: ConversationStatus.WAITING_FOR_HUMAN },
        orderBy: { updatedAt: "desc" },
        take: 20,
        select: { id: true, customerName: true, customerEmail: true, escalationReason: true, updatedAt: true },
      }),
      this.prisma.lead.findMany({
        where: { organizationId, score: { gte: 70 }, status: { in: [LeadStatus.NEW, LeadStatus.QUALIFIED] } },
        orderBy: [{ score: "desc" }, { updatedAt: "desc" }],
        take: 20,
        select: { id: true, name: true, email: true, score: true, summary: true, updatedAt: true },
      }),
      this.prisma.task.findMany({
        where: { organizationId, priority: TaskPriority.HIGH, status: TaskStatus.OPEN },
        orderBy: { updatedAt: "desc" },
        take: 20,
        select: { id: true, title: true, description: true, updatedAt: true },
      }),
    ]);

    const items: NotificationItem[] = [
      ...handoffs.map((item) => ({
        id: `handoff:${item.id}`,
        type: "HUMAN_HANDOFF" as const,
        priority: "HIGH" as const,
        title: "Human handoff needed",
        description: `${item.customerName ?? item.customerEmail ?? "Anonymous visitor"}: ${item.escalationReason ?? "Review conversation."}`,
        href: `/inbox?conversationId=${item.id}`,
        createdAt: item.updatedAt,
      })),
      ...leads.map((item) => ({
        id: `lead:${item.id}`,
        type: "HIGH_SCORE_LEAD" as const,
        priority: item.score >= 85 ? "HIGH" as const : "MEDIUM" as const,
        title: `High-score lead: ${item.score}`,
        description: `${item.name ?? item.email ?? "New lead"}: ${item.summary}`,
        href: "/reception-ai",
        createdAt: item.updatedAt,
      })),
      ...tasks.map((item) => ({
        id: `task:${item.id}`,
        type: "HIGH_PRIORITY_TASK" as const,
        priority: "HIGH" as const,
        title: item.title,
        description: item.description,
        href: "/reception-ai",
        createdAt: item.updatedAt,
      })),
    ].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    return {
      total: items.length,
      highPriority: items.filter((item) => item.priority === "HIGH").length,
      items,
      emailReady: items.map((item) => ({
        subject: `[Autopilot One] ${item.title}`,
        preview: item.description.slice(0, 180),
        href: item.href,
      })),
    };
  }
}
