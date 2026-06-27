import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";

@Injectable()
export class LaunchService {
  constructor(private readonly prisma: PrismaService) {}

  async getChecklist(organizationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true,
        slug: true,
        businessDna: true,
        widgetEnabled: true,
        widgetToken: true,
        widgetAllowedOrigins: true,
        billingPlan: true,
      },
    });

    if (!organization) throw new NotFoundException("Organization not found");

    const [knowledgeSources, publicConversations, inboxHandoffs, notifications, widgetEvents] = await Promise.all([
      this.prisma.knowledgeSource.count({ where: { organizationId } }),
      this.prisma.receptionConversation.count({ where: { organizationId, channel: { startsWith: "public-web" } } }),
      this.prisma.receptionConversation.count({ where: { organizationId, status: "WAITING_FOR_HUMAN" } }),
      this.prisma.task.count({ where: { organizationId, status: "OPEN", priority: "HIGH" } }),
      this.prisma.widgetEvent.count({ where: { organizationId } }),
    ]);

    const steps = [
      {
        id: "business-dna",
        title: "Complete Business DNA",
        description: "Add company summary, tone, FAQ, services and operating rules.",
        href: "/onboarding",
        complete: Boolean(organization.businessDna),
      },
      {
        id: "knowledge-base",
        title: "Add Knowledge Base sources",
        description: "Upload documents or add website sources so Reception AI has context.",
        href: "/knowledge-base",
        complete: knowledgeSources > 0,
      },
      {
        id: "widget-settings",
        title: "Configure website widget",
        description: "Enable the widget and copy the install snippet.",
        href: "/widget-settings",
        complete: organization.widgetEnabled,
      },
      {
        id: "widget-analytics",
        title: "Verify widget install health",
        description: "Load the widget once and confirm analytics are visible.",
        href: "/widget-analytics",
        complete: widgetEvents > 0,
      },
      {
        id: "public-conversation",
        title: "Send a public test message",
        description: "Use the widget or demo page to create a website conversation.",
        href: "/widget-demo",
        complete: publicConversations > 0,
      },
      {
        id: "inbox",
        title: "Review Inbox workflow",
        description: "Open the unified inbox and review a conversation timeline.",
        href: "/inbox",
        complete: publicConversations > 0 || inboxHandoffs > 0,
      },
      {
        id: "notifications",
        title: "Review notification center",
        description: "Check active handoffs, high-score leads and high-priority tasks.",
        href: "/notifications",
        complete: notifications > 0 || inboxHandoffs > 0,
      },
      {
        id: "plans-usage",
        title: "Review plan and usage limits",
        description: "Check usage cards and current plan before pilot launch.",
        href: "/billing",
        complete: Boolean(organization.billingPlan),
      },
    ];

    const completed = steps.filter((step) => step.complete).length;

    return {
      organization: {
        id: organization.id,
        name: organization.name,
        slug: organization.slug,
      },
      completed,
      total: steps.length,
      progress: Math.round((completed / steps.length) * 100),
      readyForPilot: completed >= 6,
      metrics: {
        knowledgeSources,
        publicConversations,
        inboxHandoffs,
        notifications,
        widgetEvents,
      },
      steps,
    };
  }
}
