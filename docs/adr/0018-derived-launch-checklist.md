# ADR 0018 — Derived Launch Checklist

## Status

Accepted for BUILD #019.

## Context

Autopilot One now has enough MVP functionality to be demonstrated end-to-end. The main remaining problem is clarity: operators need one page that shows what is ready and what still needs setup before a pilot.

## Decision

Add a launch checklist as a derived view over existing product data.

The checklist reads from:

- organization profile
- Business DNA
- Knowledge Base
- widget settings
- widget analytics
- public conversations
- inbox handoffs
- tasks
- plan state

No new persistence is added for this build.

## Consequences

Positive:

- The product gets a clear demo path.
- The MVP becomes easier to evaluate.
- No new database migration is required.
- Existing product modules remain source of truth.

Tradeoffs:

- Checklist state is not manually editable.
- Operators cannot dismiss checklist items yet.
- The checklist is organization-level, not user-level.

## Follow-up

Future builds should add:

- release candidate smoke tests
- demo data generation
- checklist item dismissal
- deployment target decision
