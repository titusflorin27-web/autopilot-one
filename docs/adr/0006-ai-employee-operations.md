# ADR 0006 — AI Employee Operations Lifecycle

## Status

Accepted for BUILD #007.

## Context

BUILD #006 introduced Reception AI, but an AI Employee is only useful if humans can operate it safely.

Reception AI needs lifecycle controls for:

- human handoff
- closing conversations
- completing tasks
- qualifying or converting leads
- tracking escalation reasons
- recording internal notes

## Decision

Keep Reception AI operations in the same module and extend the existing data model with lifecycle fields instead of creating a separate operations service prematurely.

The operations API adds:

- conversation update endpoint
- human reply endpoint
- task update endpoint
- lead update endpoint
- operations summary endpoint

The UI remains at `/reception-ai` so operators can see AI response generation and operational controls in one place.

## Consequences

Positive:

- Keeps AI Employee operations simple and visible.
- Establishes the handoff loop needed before real external channels are added.
- Preserves the current RBAC model.
- Gives future AI Employees a reusable operations pattern.

Tradeoffs:

- No dedicated assignment model yet.
- No audit-log table yet beyond existing business events.
- No SLA or queue priority automation yet.

## Follow-up

Future builds should add:

- assignees
- SLA timers
- audit trail views
- channel adapters
- AI Gateway model-backed responses
- notification workflows
