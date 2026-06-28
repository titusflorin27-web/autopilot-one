import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";

type TimelineEvent = {
  id: string;
  type: "demo_request" | "conversation" | "widget_event";
  title: string;
  description: string;
  createdAt: Date;
  href?: string;
};

const demoRequestStatusLabels: Record<string, string> = {
  NEW: "Nou",
  CONTACTED: "Contactat",
  QUALIFIED: "Calificat",
  CLOSED: "Închis",
};

const conversationStatusLabels: Record<string, string> = {
  OPEN: "Deschisă",
  WAITING_FOR_HUMAN: "Așteaptă intervenție umană",
  CLOSED: "Închisă",
};

const widgetEventLabels: Record<string, string> = {
  CONFIG_LOADED: "Configurație încărcată",
  LOADED: "Widget încărcat",
  OPENED: "Widget deschis",
  MESSAGE_SENT: "Mesaj trimis",
  MESSAGE_RECEIVED: "Mesaj primit",
  ERROR: "Eroare widget",
};

function statusLabel(value: string, labels: Record<string, string>) {
  return labels[value] ?? value;
}

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getMetrics(userId: string) {
    const membership = await this.prisma.membership.findFirst({
      where: { userId },
      orderBy: { createdAt: "asc" },
      select: {
        organizationId: true,
        organization: {
          select: {
            widgetEnabled: true,
          },
        },
      },
    });

    if (!membership) {
      throw new NotFoundException("Nu există organizație pentru acest cont.");
    }

    const organizationId = membership.organizationId;

    const [demoRequestCount, leadCount, eventCount, widgetEventCount, conversationCount, taskCount, latestDemoRequests, latestConversations, latestWidgetEvents] = await Promise.all([
      this.prisma.demoRequest.count(),
      this.prisma.lead.count({ where: { organizationId } }),
      this.prisma.event.count({ where: { organizationId } }),
      this.prisma.widgetEvent.count({ where: { organizationId } }),
      this.prisma.receptionConversation.count({ where: { organizationId } }),
      this.prisma.task.count({ where: { organizationId } }),
      this.prisma.demoRequest.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          name: true,
          email: true,
          company: true,
          status: true,
          createdAt: true,
        },
      }),
      this.prisma.receptionConversation.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          customerName: true,
          customerEmail: true,
          status: true,
          createdAt: true,
        },
      }),
      this.prisma.widgetEvent.findMany({
        where: { organizationId },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: {
          id: true,
          type: true,
          websiteUrl: true,
          createdAt: true,
        },
      }),
    ]);

    const timeline = this.buildTimeline(latestDemoRequests, latestConversations, latestWidgetEvents);
    const eventsProcessed = eventCount + widgetEventCount + conversationCount + taskCount + demoRequestCount;
    const capturedLeads = demoRequestCount + leadCount;
    const activeAiEmployees = membership.organization.widgetEnabled ? 3 : 2;

    return {
      metrics: [
        {
          label: "Clienți potențiali captați",
          value: capturedLeads,
          helper: `${demoRequestCount} cereri demo · ${leadCount} lead-uri widget`,
          href: "/demo-requests",
          ctaLabel: "Vezi cererile demo",
        },
        {
          label: "Ore economisite",
          value: this.estimateSavedHours(eventsProcessed, capturedLeads),
          helper: "Estimare operațională bazată pe activitatea procesată",
          href: "/dashboard",
          ctaLabel: "Actualizat din date reale",
        },
        {
          label: "Evenimente procesate",
          value: eventsProcessed,
          helper: `${widgetEventCount} evenimente widget · ${conversationCount} conversații · ${demoRequestCount} cereri demo`,
          href: "/widget-analytics",
          ctaLabel: "Vezi analiza widgetului",
        },
        {
          label: "Angajați cu inteligență artificială",
          value: activeAiEmployees,
          helper: membership.organization.widgetEnabled ? "Recepție AI, Vânzări AI, CEO AI" : "Vânzări AI, CEO AI",
          href: "/reception-ai",
          ctaLabel: "Vezi Recepție AI",
        },
      ],
      timeline,
    };
  }

  private estimateSavedHours(eventsProcessed: number, capturedLeads: number) {
    return Math.max(0, Math.round(eventsProcessed * 0.12 + capturedLeads * 0.35));
  }

  private buildTimeline(
    demoRequests: Array<{ id: string; name: string; email: string; company: string | null; status: string; createdAt: Date }>,
    conversations: Array<{ id: string; customerName: string | null; customerEmail: string | null; status: string; createdAt: Date }>,
    widgetEvents: Array<{ id: string; type: string; websiteUrl: string | null; createdAt: Date }>,
  ) {
    const demoEvents: TimelineEvent[] = demoRequests.map((request) => ({
      id: request.id,
      type: "demo_request",
      title: `Cerere demo nouă: ${request.name}`,
      description: `${request.company ?? request.email} · ${statusLabel(request.status, demoRequestStatusLabels)}`,
      createdAt: request.createdAt,
      href: "/demo-requests",
    }));

    const conversationEvents: TimelineEvent[] = conversations.map((conversation) => ({
      id: conversation.id,
      type: "conversation",
      title: `Conversație Recepție AI: ${conversation.customerName ?? conversation.customerEmail ?? "vizitator"}`,
      description: `Status conversație: ${statusLabel(conversation.status, conversationStatusLabels)}`,
      createdAt: conversation.createdAt,
      href: "/inbox",
    }));

    const widgetTimelineEvents: TimelineEvent[] = widgetEvents.map((event) => ({
      id: event.id,
      type: "widget_event",
      title: `Eveniment widget: ${statusLabel(event.type, widgetEventLabels)}`,
      description: event.websiteUrl ?? "Website nespecificat",
      createdAt: event.createdAt,
      href: "/widget-analytics",
    }));

    const timeline = [...demoEvents, ...conversationEvents, ...widgetTimelineEvents]
      .sort((first, second) => second.createdAt.getTime() - first.createdAt.getTime())
      .slice(0, 6);

    if (timeline.length) {
      return timeline;
    }

    return [
      {
        id: "empty-dashboard-timeline",
        type: "demo_request" as const,
        title: "Nu există evenimente recente încă.",
        description: "Trimite o cerere demo sau testează widgetul pentru a popula dashboardul.",
        createdAt: new Date(),
        href: "/demo",
      },
    ];
  }
}
