export type ID = string;

export type OrganizationStatus = "active" | "suspended" | "deleted";
export type UserRole = "owner" | "admin" | "member";
export type EventStatus = "pending" | "processing" | "completed" | "failed";
export type KnowledgeSourceType = "TXT" | "PDF" | "DOCX" | "WEBSITE";
export type KnowledgeSourceStatus = "UPLOADED" | "INDEXED" | "FAILED";
export type ConversationStatus = "OPEN" | "WAITING_FOR_HUMAN" | "CLOSED";
export type MessageSender = "CUSTOMER" | "AI" | "HUMAN" | "SYSTEM";
export type LeadStatus = "NEW" | "QUALIFIED" | "DISQUALIFIED" | "CONVERTED";
export type TaskStatus = "OPEN" | "DONE" | "CANCELLED";
export type TaskPriority = "LOW" | "MEDIUM" | "HIGH";

export interface BusinessEvent<TPayload = unknown> {
  id: ID;
  organizationId: ID;
  type: string;
  payload: TPayload;
  status: EventStatus;
  createdAt: string;
}

export interface BusinessDnaItem {
  title: string;
  description: string;
}

export interface BusinessDnaRule {
  title: string;
  description: string;
}

export interface BusinessDnaFaq {
  question: string;
  answer: string;
}

export interface BusinessDnaGoal {
  title: string;
  metric?: string;
  target?: string;
}

export interface BusinessDna {
  summary: string;
  products: BusinessDnaItem[];
  services: BusinessDnaItem[];
  rules: BusinessDnaRule[];
  tone: string;
  faq: BusinessDnaFaq[];
  objectives: BusinessDnaGoal[];
}

export interface KnowledgeSourceSummary {
  id: ID;
  organizationId: ID;
  type: KnowledgeSourceType;
  status: KnowledgeSourceStatus;
  title: string;
  url?: string | null;
  fileName?: string | null;
  mimeType?: string | null;
  chunkCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface KnowledgeSearchResult {
  chunkId: ID;
  sourceId: ID;
  sourceTitle: string;
  sourceType: KnowledgeSourceType;
  content: string;
  score: number;
}

export interface ReceptionAiResult {
  conversationId: ID;
  reply: string;
  confidence: number;
  shouldEscalate: boolean;
  escalationReason?: string | null;
  leadId?: ID | null;
  taskId?: ID | null;
  aiProvider?: string;
  aiModel?: string;
  usedFallback?: boolean;
  citations: KnowledgeSearchResult[];
}

export interface ReceptionConversationSummary {
  id: ID;
  organizationId: ID;
  customerName?: string | null;
  customerEmail?: string | null;
  channel: string;
  status: ConversationStatus;
  escalationReason?: string | null;
  internalNote?: string | null;
  closedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReceptionOperationsSummary {
  conversations: Record<ConversationStatus, number> | Record<string, number>;
  tasks: Record<TaskStatus, number> | Record<string, number>;
  leads: Record<LeadStatus, number> | Record<string, number>;
}
