# BUILD #015 — Unified Inbox

Status: implemented on branch `codex/build-015-unified-inbox`.

## Scope

BUILD #015 adds the first operator inbox for Reception AI conversations.

The goal is to stop treating website conversations, internal conversations, escalations and human replies as separate screens. Operators now have one place to triage and act.

## API

New protected endpoints:

```http
GET /api/inbox/organization/:organizationId/conversations
GET /api/inbox/organization/:organizationId/conversations/:conversationId
```

Optional list filters:

```http
?status=OPEN
?status=WAITING_FOR_HUMAN
?status=CLOSED
?source=public-web
?source=web
```

The endpoints are protected by the existing organization RBAC model.

## UI

New page:

```http
/inbox
```

Included:

- conversation list
- source filter
- status filter
- conversation detail panel
- message timeline
- lead summary panel
- escalation reason display
- conversation actions: open, handoff, close
- human reply form

## Design choice

This build intentionally does not add a new database table. It uses the existing Reception AI conversation and message models.

That keeps the build smaller and reduces migration risk.

## Validation

Expected CI commands:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next build

BUILD #016 should add notifications:

- notification model
- human handoff alerts
- high-score lead alerts
- dashboard notification center
- email-ready event payloads
