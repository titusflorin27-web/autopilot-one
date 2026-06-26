export type ID = string;

export type OrganizationStatus = "active" | "suspended" | "deleted";
export type UserRole = "owner" | "admin" | "member";
export type EventStatus = "pending" | "processing" | "completed" | "failed";

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
