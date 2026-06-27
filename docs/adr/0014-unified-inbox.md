# ADR 0014 — Unified Inbox over Reception Conversations

## Status

Accepted for BUILD #015.

## Context

Reception AI now supports public website intake, widget analytics, leads, tasks and human handoff. Operators need one triage surface instead of jumping between widget analytics and Reception AI operations.

## Decision

Add a dedicated `inbox` API module and `/inbox` UI page.

The inbox reads from existing Reception AI conversation, message and lead data. No new database table is introduced in this build.

The inbox provides:

- organization-scoped conversation list
- source and status filters
- conversation detail
- message timeline
- lead context
- human reply through the existing Reception AI endpoint
- conversation lifecycle actions through the existing Reception AI endpoint

## Consequences

Positive:

- Operators get one action surface.
- Build stays small and low-risk.
- No migration is needed.
- Existing RBAC and conversation workflows remain source of truth.

Tradeoffs:

- Inbox assignment is not modeled yet.
- Saved views are not modeled yet.
- Search is not implemented yet.
- Notifications are still a follow-up build.

## Follow-up

Future builds should add:

- notifications
- ownership / assignment
- search
- saved filters
- SLA tracking
