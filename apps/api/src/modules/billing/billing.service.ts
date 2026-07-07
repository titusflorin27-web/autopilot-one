import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { BillingPlan, BillingStatus, Prisma, WidgetEventType } from "@prisma/client";
import Stripe from "stripe";
import { PrismaService } from "../../common/prisma.service";

const PLAN_LIMITS: Record<BillingPlan, { widgetMessages: number; knowledgeSources: number; teamMembers: number }> = {
  FREE: { widgetMessages: 100, knowledgeSources: 5, teamMembers: 1 },
  STARTER: { widgetMessages: 1000, knowledgeSources: 50, teamMembers: 3 },
  PRO: { widgetMessages: 10000, knowledgeSources: 500, teamMembers: 10 },
  BUSINESS: { widgetMessages: 50000, knowledgeSources: 2000, teamMembers: 50 },
};

const STRIPE_TO_BILLING_STATUS: Record<string, BillingStatus> = {
  trialing: BillingStatus.TRIALING,
  active: BillingStatus.ACTIVE,
  past_due: BillingStatus.PAST_DUE,
  unpaid: BillingStatus.PAST_DUE,
  incomplete: BillingStatus.PAST_DUE,
  incomplete_expired: BillingStatus.CANCELLED,
  canceled: BillingStatus.CANCELLED,
};

type StripeCustomerLinkedObject = {
  metadata?: Stripe.Metadata | null;
  customer?: string | Stripe.Customer | Stripe.DeletedCustomer | null;
};

function secondsToDate(value: unknown) {
  return typeof value === "number" ? new Date(value * 1000) : undefined;
}

function isEnabledFlag(value?: string) {
  return ["1", "true", "yes", "on"].includes((value ?? "").trim().toLowerCase());
}

@Injectable()
export class BillingService {
  private stripeClient?: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {}

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
        billingCurrentPeriodEnd: true,
        stripeCustomerId: true,
        stripeSubscriptionId: true,
        stripePriceId: true,
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

    const { stripeCustomerId, stripeSubscriptionId, stripePriceId, ...safeOrganization } = organization;
    const stripeConfigured = this.isStripeConfigured();

    return {
      organization: {
        ...safeOrganization,
        hasStripeCustomer: Boolean(stripeCustomerId),
        hasStripeSubscription: Boolean(stripeSubscriptionId),
        hasStripePrice: Boolean(stripePriceId),
      },
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
        widgetMessages: widgetMessages > limits.widgetMessages,
        knowledgeSources: knowledgeSources > limits.knowledgeSources,
        teamMembers: teamMembers > limits.teamMembers,
      },
      plans: Object.entries(PLAN_LIMITS).map(([plan, planLimits]) => ({ plan, limits: planLimits })),
      paymentProvider: {
        provider: "stripe",
        configured: stripeConfigured,
        checkoutEnabled: this.isStripeCheckoutEnabled(),
        portalEnabled: stripeConfigured && Boolean(stripeCustomerId),
      },
    };
  }

  async createCheckoutSession(organizationId: string, plan: BillingPlan) {
    if (plan === BillingPlan.FREE) {
      throw new BadRequestException("FREE plan does not require checkout");
    }

    if (plan === BillingPlan.BUSINESS) {
      throw new BadRequestException("BUSINESS plan requires manual activation");
    }

    if (!this.isStripeCheckoutEnabled()) {
      throw new ServiceUnavailableException("Stripe checkout is not enabled yet");
    }

    const stripe = this.getStripeClient();
    const priceId = this.getStripePriceId(plan);

    if (!priceId) {
      throw new ServiceUnavailableException(`Stripe price is not configured for ${plan}`);
    }

    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true, name: true, slug: true, stripeCustomerId: true },
    });

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    let customerId = organization.stripeCustomerId ?? undefined;

    if (!customerId) {
      const customer = await stripe.customers.create({
        name: organization.name,
        metadata: { organizationId: organization.id, organizationSlug: organization.slug },
      });
      customerId = customer.id;

      await this.prisma.organization.update({
        where: { id: organizationId },
        data: { stripeCustomerId: customerId },
      });
    }

    const appUrl = this.publicAppUrl();
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      customer: customerId,
      client_reference_id: organization.id,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/billing?checkout=success&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/billing?checkout=cancelled`,
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      metadata: { organizationId: organization.id, plan, priceId },
      subscription_data: {
        metadata: { organizationId: organization.id, plan, priceId },
      },
    });

    if (!session.url) {
      throw new InternalServerErrorException("Stripe checkout session did not return a URL");
    }

    await this.prisma.event.create({
      data: {
        organizationId,
        type: "billing.checkout_session_created",
        payload: { plan, priceId, sessionId: session.id } as Prisma.JsonObject,
      },
    });

    return { url: session.url };
  }

  async createCustomerPortalSession(organizationId: string) {
    const stripe = this.getStripeClient();
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: { id: true, stripeCustomerId: true },
    });

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    if (!organization.stripeCustomerId) {
      throw new BadRequestException("No Stripe customer is linked to this organization yet");
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: organization.stripeCustomerId,
      return_url: `${this.publicAppUrl()}/billing`,
    });

    return { url: portalSession.url };
  }

  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    const stripe = this.getStripeClient();
    const endpointSecret = this.config.get<string>("STRIPE_WEBHOOK_SECRET");

    if (!endpointSecret) {
      throw new ServiceUnavailableException("Stripe webhook secret is not configured");
    }

    const event = stripe.webhooks.constructEvent(rawBody, signature, endpointSecret);

    if (event.type === "checkout.session.completed") {
      await this.handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session);
    } else if (
      event.type === "customer.subscription.created" ||
      event.type === "customer.subscription.updated" ||
      event.type === "customer.subscription.deleted"
    ) {
      await this.handleSubscriptionEvent(event.data.object as Stripe.Subscription, event.type);
    } else if (event.type === "invoice.payment_failed") {
      await this.handleInvoiceStatusEvent(event.data.object as Stripe.Invoice, BillingStatus.PAST_DUE, event.type);
    } else if (event.type === "invoice.payment_succeeded") {
      await this.handleInvoiceStatusEvent(event.data.object as Stripe.Invoice, BillingStatus.ACTIVE, event.type);
    }

    return { received: true, id: event.id, type: event.type };
  }

  async updatePlan(organizationId: string, plan: BillingPlan) {
    if (!this.manualPlanUpdatesEnabled()) {
      throw new ServiceUnavailableException("Manual billing plan updates are disabled");
    }

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: { billingPlan: plan, billingStatus: BillingStatus.ACTIVE, billingCurrentPeriodStart: new Date() },
    });

    await this.prisma.event.create({
      data: {
        organizationId,
        type: "billing.plan_updated",
        payload: { plan } as Prisma.JsonObject,
      },
    });

    return this.getBillingOverview(organizationId);
  }

  private getStripeClient() {
    const secretKey = this.config.get<string>("STRIPE_SECRET_KEY");

    if (!secretKey) {
      throw new ServiceUnavailableException("Stripe is not configured");
    }

    if (!this.stripeClient) {
      this.stripeClient = new Stripe(secretKey);
    }

    return this.stripeClient;
  }

  private isStripeConfigured() {
    return Boolean(this.config.get<string>("STRIPE_SECRET_KEY"));
  }

  private isStripeCheckoutEnabled() {
    return this.isStripeConfigured() && isEnabledFlag(this.config.get<string>("STRIPE_CHECKOUT_ENABLED")) && this.hasSelfServeStripePrices();
  }

  private manualPlanUpdatesEnabled() {
    return isEnabledFlag(this.config.get<string>("MANUAL_BILLING_PLAN_UPDATES_ENABLED"));
  }

  private hasSelfServeStripePrices() {
    return Boolean(this.config.get<string>("STRIPE_PRICE_STARTER") && this.config.get<string>("STRIPE_PRICE_PRO"));
  }

  private getStripePriceId(plan: BillingPlan) {
    const prices: Partial<Record<BillingPlan, string | undefined>> = {
      STARTER: this.config.get<string>("STRIPE_PRICE_STARTER"),
      PRO: this.config.get<string>("STRIPE_PRICE_PRO"),
      BUSINESS: this.config.get<string>("STRIPE_PRICE_BUSINESS"),
    };

    return prices[plan];
  }

  private getPlanFromPriceId(priceId?: string | null) {
    if (!priceId) return null;

    const entries: Array<[BillingPlan, string | undefined]> = [
      [BillingPlan.STARTER, this.config.get<string>("STRIPE_PRICE_STARTER")],
      [BillingPlan.PRO, this.config.get<string>("STRIPE_PRICE_PRO")],
      [BillingPlan.BUSINESS, this.config.get<string>("STRIPE_PRICE_BUSINESS")],
    ];

    return entries.find(([, configuredPriceId]) => configuredPriceId === priceId)?.[0] ?? null;
  }

  private parseBillingPlan(value?: string | null) {
    if (!value) return null;
    return Object.values(BillingPlan).includes(value as BillingPlan) ? (value as BillingPlan) : null;
  }

  private mapStripeStatus(status?: string | null) {
    return status ? STRIPE_TO_BILLING_STATUS[status] ?? BillingStatus.PAST_DUE : BillingStatus.PAST_DUE;
  }

  private publicAppUrl() {
    return this.config.get<string>("PUBLIC_APP_URL") ?? "https://app.autopilot-one.com";
  }

  private async handleCheckoutCompleted(session: Stripe.Checkout.Session) {
    const organizationId = session.metadata?.organizationId ?? session.client_reference_id;

    if (!organizationId) {
      return;
    }

    const customerId = typeof session.customer === "string" ? session.customer : session.customer?.id ?? null;
    const subscriptionId = typeof session.subscription === "string" ? session.subscription : session.subscription?.id ?? null;
    const plan = this.parseBillingPlan(session.metadata?.plan);

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        ...(customerId ? { stripeCustomerId: customerId } : {}),
        ...(subscriptionId ? { stripeSubscriptionId: subscriptionId } : {}),
        ...(plan ? { billingPlan: plan } : {}),
        billingStatus: BillingStatus.ACTIVE,
      },
    });

    await this.prisma.event.create({
      data: {
        organizationId,
        type: "billing.checkout_completed",
        payload: { sessionId: session.id, plan: plan ?? undefined } as Prisma.JsonObject,
      },
    });
  }

  private async handleSubscriptionEvent(subscription: Stripe.Subscription, eventType: string) {
    const organizationId = await this.resolveOrganizationIdFromStripeObject(subscription);

    if (!organizationId) {
      return;
    }

    const priceId = subscription.items?.data?.[0]?.price?.id ?? null;
    const plan = this.getPlanFromPriceId(priceId) ?? this.parseBillingPlan(subscription.metadata?.plan);
    const customerId = typeof subscription.customer === "string" ? subscription.customer : subscription.customer?.id ?? null;
    const periodStart = secondsToDate((subscription as unknown as Record<string, unknown>).current_period_start);
    const periodEnd = secondsToDate((subscription as unknown as Record<string, unknown>).current_period_end);

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        ...(customerId ? { stripeCustomerId: customerId } : {}),
        stripeSubscriptionId: subscription.id,
        ...(priceId ? { stripePriceId: priceId } : {}),
        ...(plan ? { billingPlan: plan } : {}),
        billingStatus: this.mapStripeStatus(subscription.status),
        ...(periodStart ? { billingCurrentPeriodStart: periodStart } : {}),
        ...(periodEnd ? { billingCurrentPeriodEnd: periodEnd } : {}),
      },
    });

    await this.prisma.event.create({
      data: {
        organizationId,
        type: "billing.subscription_synced",
        payload: { eventType, subscriptionId: subscription.id, status: subscription.status, plan: plan ?? undefined } as Prisma.JsonObject,
      },
    });
  }

  private async handleInvoiceStatusEvent(invoice: Stripe.Invoice, status: BillingStatus, eventType: string) {
    const organizationId = await this.resolveOrganizationIdFromStripeObject(invoice);

    if (!organizationId) {
      return;
    }

    await this.prisma.organization.update({
      where: { id: organizationId },
      data: { billingStatus: status },
    });

    await this.prisma.event.create({
      data: {
        organizationId,
        type: "billing.invoice_status_synced",
        payload: { eventType, status } as Prisma.JsonObject,
      },
    });
  }

  private async resolveOrganizationIdFromStripeObject(value: StripeCustomerLinkedObject) {
    const metadata = value.metadata;
    if (metadata?.organizationId) return metadata.organizationId;

    const customer = value.customer;
    const customerId = typeof customer === "string" ? customer : customer?.id;

    if (!customerId) {
      return null;
    }

    const organization = await this.prisma.organization.findFirst({
      where: { stripeCustomerId: customerId },
      select: { id: true },
    });

    return organization?.id ?? null;
  }
}
