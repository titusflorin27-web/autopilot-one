# ADR 0008 — Public Web Intake

## Status

Accepted for BUILD #009.

## Context

Reception AI needs to move beyond internal simulation and become accessible from a public website channel.

The system already has:

- identity
- organizations
- Business DNA
- Knowledge Base
- Reception AI
- AI Gateway
- human handoff operations

The next product step is allowing a customer to start a Reception AI conversation without being authenticated.

## Decision

Add a public Reception AI endpoint based on organization slug:

```http
POST /api/public/reception-ai/message
```

The public endpoint uses the same Reception AI service path as the authenticated endpoint, but wraps it with public constraints:

- organization lookup by slug
- active organization check
- DTO input limits
- safe public response shape
- no internal task or lead identifiers in response

A `/widget-demo` page demonstrates the public website widget behavior.

## Consequences

Positive:

- Reception AI now has a real public acquisition surface.
- Website visitors can create conversations and leads.
- Internal operations still receive conversations, leads and tasks.
- Public channel can use AI Gateway or deterministic fallback.

Tradeoffs:

- This build does not yet include rate limiting.
- This build does not yet include widget tokens.
- This build does not yet include origin allowlisting.
- Public endpoint security must be hardened before production exposure.

## Follow-up

Future builds should add:

- rate limits
- signed widget tokens
- origin/domain allowlist
- spam controls
- embeddable script snippet
- public widget settings per organization
