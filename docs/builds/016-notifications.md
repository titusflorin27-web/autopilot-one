# BUILD #016 — Notifications

Status: implemented on branch `codex/build-016-notifications`.

## Scope

BUILD #016 adds the first notification center for Autopilot One.

This build is intentionally implemented without a database migration. Notifications are derived from existing operational data:

- Reception AI conversations waiting for human handoff
- high-score leads
- high-priority open tasks

## API

New protected endpoint:

```http
GET /api/notifications/organization/:organizationId
```

Returns:

- total active notifications
- high-priority count
- active notification items
- email-ready payloads

## UI

New page:

```http
/notifications
```

Included:

- notification metrics
- high-priority count
- active notification list
- links to Inbox or Reception AI
- email-ready payload preview

## Notification types

- `HUMAN_HANDOFF`
- `HIGH_SCORE_LEAD`
- `HIGH_PRIORITY_TASK`

## Design choice

This version is a derived notification center. It does not persist read/unread state yet.

That keeps the build stable and avoids extra schema work before the notification behavior is validated.

## Validation

Expected CI commands:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next build

BUILD #017 should add billing and usage limits:

- plan definitions
- usage counters
- organization plan status
- limits for widget messages
- limits for knowledge sources
- basic billing readiness UI
