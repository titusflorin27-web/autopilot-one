# BUILD #014 — Widget Analytics / Install Health

Status: implemented on branch `codex/build-014-widget-analytics`.

## Scope

BUILD #014 adds observability for the public Reception AI widget.

Operators can now see whether the widget is installed, loading, being opened and producing public conversations.

## Data model

New enum:

```prisma
enum WidgetEventType {
  CONFIG_LOADED
  LOADED
  OPENED
  MESSAGE_SENT
  MESSAGE_RECEIVED
  ERROR
}
```

New model:

```prisma
model WidgetEvent {
  id             String
  organizationId String
  type           WidgetEventType
  visitorId      String?
  conversationId String?
  websiteUrl     String?
  origin         String?
  userAgent      String?
  metadata       Json?
  createdAt      DateTime
}
```

## Public tracking endpoint

```http
POST /api/public/reception-ai/widget/event
```

Request body:

```json
{
  "organizationSlug": "your-company-slug",
  "type": "OPENED",
  "visitorId": "Stable anonymous visitor id",
  "conversationId": "Optional conversation id",
  "websiteUrl": "https://customer-site.example",
  "metadata": {}
}
```

## Protected analytics endpoint

```http
GET /api/reception-ai/organization/:organizationId/widget-analytics
```

Returns:

- install health
- event counts
- public funnel metrics
- domain/source reporting
- recent widget events

## Widget script telemetry

`/autopilot-widget.js` now emits:

- `LOADED`
- `OPENED`
- `ERROR`

Server-side public message handling emits:

- `CONFIG_LOADED`
- `MESSAGE_SENT`
- `MESSAGE_RECEIVED`

## UI

New page:

```http
/widget-analytics
```

It shows:

- config loaded status
- widget opened count
- messages sent count
- public conversations
- public leads
- follow-up tasks
- event counts
- domains
- recent widget events

## Validation

Expected CI commands:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next build

BUILD #015 should add a unified inbox for all conversations:

- one operator inbox
- public website conversations
- internal demo conversations
- filters by status/source
- conversation detail view
- human reply from inbox
