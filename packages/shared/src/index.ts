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
