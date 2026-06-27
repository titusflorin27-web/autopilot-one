import { Injectable, NotFoundException } from "@nestjs/common";
import { BillingPlan, BillingStatus, WidgetEventType } from "@prisma/client";
import { PrismaService } from "../../common/prisma.service";

const PLAN_LIMITS: Record<BillingPlan, { widgetMessages: number; knowledgeSources: number; teamMembers: number }> = {
  FREE: { widgetMessages: 100, knowledgeSources: 5, teamMembers: 1 },
  STARTER: { widgetMessages: 1000, knowledgeSources: 50, teamMembers: 3 },
  PRO: { widgetMessages: 10000, knowledgeSources: 500, teamMembers: 10 },
  BUSINESS: { widgetMessages: 50000, knowledgeSources: 2000, teamMembers: 50 },
};

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  async getBillingOverview(organizationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true,
        slug: true,
        billingPlan: true,
        billingStatus: true,
        billingCurrentPeriodStart: true,
      },
    });

    if (!organization) throw new NotFoundException("Organization not found");

    const limits = PLAN_LIMITS[organization.billingPlan];
    const periodStart = organization.billingCurrentPeriodStart;
    const [widgetMessages, knowledgeSources, teamMembers] = await Promise.all([
      this.prisma.widgetEvent.count({
        where: { organizationId, type: WidgetEventType.MESSAGE_SENT, createdAt: { gte: periodStart } },
      }),
      this.prisma.knowledgeSource.count({ where: { organizationId } }),
      this.prisma.membership.count({ where: { organizationId } }),
    ]);

    return {
      organization,
      limits,
      usage: {
        widgetMessages,
        knowledgeSources,
        teamMembers,
      },
      remaining: {
        widgetMessages: Math.max(0, limits.widgetMessages - widgetMessages),
        knowledgeSources: Math.max(0, limits.knowledgeSources - knowledgeSources),
        teamMembers: Math.max(0, limits.teamMembers - teamMembers),
      },
      overLimit: {
        widgetMessages: widgetMessages >= limits.widgetMessages,
        knowledgeSources: knowledgeSources >= limits.knowledgeSources,
        teamMembers: teamMembers >= limits.teamMembers,
      },
      plans: Object.entries(PLAN_LIMITS).map(([plan, planLimits]) => ({ plan, limits: planLimits })),
    };
  }

  async updatePlan(organizationId: string, plan: BillingPlan) {
    await this.prisma.organization.update({
      where: { id: organizationId },
      data: { billingPlan: plan, billingStatus: BillingStatus.ACTIVE, billingCurrentPeriodStart: new Date() },
    });

    await this.prisma.event.create({
      data: {
        organizationId,
        type: "billing.plan_updated",
        payload: { plan } as Record<string, string>,
      },
    });

    return this.getBillingOverview(organizationId);
  }
}
