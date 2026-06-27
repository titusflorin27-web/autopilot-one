# ADR 0010 — Embeddable Widget Static Script

## Status

Accepted for BUILD #011.

## Context

Reception AI needs to be installable on customer websites. The product already has a public endpoint and public channel guardrails, so the next step is a real browser widget.

A full widget platform could include a build pipeline, package distribution, theming, iframe isolation and settings UI. That is larger than the current build.

## Decision

Ship the first widget as a static script from the Next.js public directory:

```text
apps/web/public/autopilot-widget.js
```

The script is configured through HTML `data-*` attributes and calls the public Reception AI endpoint directly.

Supported attributes:

- `data-organization-slug`
- `data-api-url`
- `data-title`
- `data-widget-token`

The widget stores a stable anonymous visitor id and conversation id in browser storage so public conversations can continue across messages.

## Consequences

Positive:

- Very easy install path for demos and early customers.
- No extra build tooling required.
- Works with the existing public Reception AI endpoint.
- Keeps product momentum toward real customer acquisition.

Tradeoffs:

- Styling is inline and basic.
- No iframe isolation yet.
- No organization-level widget settings UI yet.
- No copy-to-clipboard install manager yet.
- No hosted versioning strategy for the widget script yet.

## Follow-up

Future builds should add:

- per-organization widget settings
- generated widget tokens
- allowed domains per organization
- iframe isolation or stronger style isolation
- script versioning
- copy-to-clipboard install UI
