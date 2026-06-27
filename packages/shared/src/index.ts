export type ID = string;
export type OrganizationStatus = "active" | "suspended" | "deleted";
export type UserRole = "owner" | "admin" | "member";
export type EventStatus = "pending" | "processing" | "failed" | "completed";
export type KnowledgeSourceType = "TXT" | "PDF" | "DOCX" | "WEBSITE";
export type KnowledgeSourceStatus = "UPLOADED" | "INDEXED" | "FAILED";
export type ConversationStatus = "OPEN" | "WAITING_FOR_HUMAN" | "CLOSED";
export type MessageSender = "CUSTOMER" | "AI" | "HUMAN" | "SYSTEM";
export type LeadStatus = "NEW" | "QUALIFIED" | "DISQUALIFIED" | "CONVERTED";
export type TaskStatus = "OPEN" | "DONE" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";
export type WidgetPosition = "LEFT" | "RIGHT";
export type WidgetEventType = "CONFIG_LOADED" | "LOADED" | "OPENED" | "MESSAGE_SENT" | "MESSAGE_RECEIVED" | "ERROR";
export type NotificationType = "HUMAN_HANDOFF" | "HIGH_SCORE_LEAD" | "HIGH_PRIORITY_TASK";
export type NotificationPriority = "LOW" | "MEDIUM" | "HIGH";
export type BillingPlan = "FREE" | "STARTER" | "PRO" | "BUSINESS";
export type BillingStatus = "TRIALING" | "ACTIVE" | "PAST_DUE" | "CANCELLED";
export interface BusinessEvent<TPayload = unknown> { id: ID; organizationId: ID; type: string; payload: TPayload; status: EventStatus; createdAt: string; }
export interface BusinessDnaItem { title: string; description: string; }
export interface BusinessDnaRule { title: string; description: string; }
export interface BusinessDnaFaq { question: string; answer: string; }
export interface BusinessDnaGoal { title: string; metric?: string; target?: string; }
export interface BusinessDna { summary: string; products: BusinessDnaItem[]; services: BusinessDnaItem[]; rules: BusinessDnaRule[]; tone: string; faq: BusinessDnaFaq[]; objectives: BusinessDnaGoal[]; }
export interface WidgetSettings { id: ID; name: string; slug: string; widgetEnabled: boolean; widgetTitle: string; widgetPrimaryColor: string; widgetPosition: WidgetPosition; widgetToken?: string | null; widgetAllowedOrigins: string[]; publicConfigEndpoint: string; installSnippet: string; }
export interface PublicWidgetConfig { organizationSlug: string; widgetEnabled: boolean; title: string; primaryColor: string; position: WidgetPosition; rateLimit?: { windowSeconds: number; max: number; }; }
export interface WidgetAnalytics { windowDays: number; installHealth: { hasConfigLoad: boolean; hasWidgetLoad: boolean; hasWidgetOpen: boolean; hasMessageSent: boolean; lastEventAt?: string | null; }; events: Record<string, number>; publicFunnel: { conversations: number; messages: number; leads: number; tasks: number; }; domains: Record<string, number>; recentEvents: Array<{ id: ID; type: WidgetEventType; visitorId?: string | null; conversationId?: string | null; websiteUrl?: string | null; origin?: string | null; userAgent?: string | null; metadata?: unknown; createdAt: string; }>; }
export interface NotificationItem { id: string; type: NotificationType; priority: NotificationPriority; title: string; description: string; href: string; createdAt: string; }
export interface NotificationEmailPayload { subject: string; preview: string; href: string; }
export interface NotificationCenter { total: number; highPriority: number; items: NotificationItem[]; emailReady: NotificationEmailPayload[]; }
export interface BillingLimits { widgetMessages: number; knowledgeSources: number; teamMembers: number; }
export interface BillingOverview { organization: { id: ID; name: string; slug: string; billingPlan: BillingPlan; billingStatus: BillingStatus; billingCurrentPeriodStart: string; }; limits: BillingLimits; usage: BillingLimits; remaining: BillingLimits; overLimit: Record<keyof BillingLimits, boolean>; plans: Array<{ plan: BillingPlan; limits: BillingLimits }>; }
export interface LaunchStep { id: string; title: string; description: string; href: string; complete: boolean; }
export interface LaunchChecklist { organization: { id: ID; name: string; slug: string; }; completed: number; total: number; progress: number; readyForPilot: boolean; metrics: Record<string, number>; steps: LaunchStep[]; }
export interface KnowledgeSourceSummary { id: ID; organizationId: ID; type: KnowledgeSourceType; status: KnowledgeSourceStatus; title: string; url?: string | null; fileName?: string | null; mimeType?: string | null; chunkCount: number; createdAt: string; updatedAt: string; }
export interface KnowledgeSearchResult { chunkId: ID; sourceId: ID; sourceTitle: string; sourceType: KnowledgeSourceType; content: string; score: number; }
export interface ReceptionAiResult { conversationId: ID; reply: string; confidence: number; shouldEscalate: boolean; escalationReason?: string | null; leadId?: ID | null; taskId?: ID | null; aiProvider?: string; aiModel?: string; usedFallback?: boolean; citations: KnowledgeSearchResult[]; }
export interface PublicReceptionAiResult { conversationId: ID; reply: string; confidence: number; shouldEscalate: boolean; escalationReason?: string | null; aiProvider?: string; aiModel?: string; usedFallback?: boolean; widget?: { title: string; primaryColor: string; position: WidgetPosition; }; rateLimit?: { windowSeconds: number; max: number; }; citations: Array<{ sourceTitle: string; score: number; }>; }
export interface ReceptionConversationSummary { id: ID; organizationId: ID; customerName?: string | null; customerEmail?: string | null; channel: string; status: ConversationStatus; escalationReason?: string | null; internalNote?: string | null; closedAt?: string | null; createdAt: string; updatedAt: string; }
export interface InboxMessage { id: ID; sender: MessageSender; content: string; createdAt: string; }
export interface InboxConversationSummary extends ReceptionConversationSummary { lead?: { id: ID; score: number; status: LeadStatus; summary: string; } | null; messages: InboxMessage[]; }
export interface InboxConversationDetail extends InboxConversationSummary { messages: InboxMessage[]; }
export interface ReceptionOperationsSummary { conversations: Record<ConversationStatus, number> | Record<string, number>; tasks: Record<TaskStatus, number> | Record<string, number>; leads: Record<LeadStatus, number> | Record<string, number>; }
