# ADR 0012 — Widget Runtime Enforcement

## Status

Accepted for BUILD #013.

## Context

Autopilot One has an embeddable Reception AI widget and organization-level widget settings. The next step is making those settings affect the live public widget experience.

The browser widget needs enough public configuration to render correctly, while internal operational details stay private.

## Decision

Add a public widget configuration endpoint:

```http
GET /api/public/reception-ai/widget/:organizationSlug/config
```

The endpoint returns only browser-safe fields:

- organization slug
- enabled state
- title
- primary color
- position
- rate-limit metadata

The public message endpoint now checks organization runtime settings before handling public messages.

The static widget script loads configuration before rendering and applies the configured title, color and position.

## Consequences

Positive:

- Widget settings now control public behavior.
- Disabled widgets stop rendering and stop accepting public messages.
- Organization-level browser origin rules are applied.
- Organization-level access rules are applied.
- The widget can update title, color and position without changing the embed snippet.

Tradeoffs:

- Rate limiting remains in-memory.
- Widget script still uses direct DOM mounting, not iframe isolation.
- Public config is not cached or versioned yet.

## Follow-up

Future builds should add:

- Redis-backed distributed rate limits
- public widget analytics
- install verification
- domain-level health reporting
- widget script versioning
- stronger theme validation
