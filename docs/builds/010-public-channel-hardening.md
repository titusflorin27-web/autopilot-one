# BUILD #010 — Public Channel Hardening

Status: implemented on branch `codex/build-010-public-channel-hardening`.

## Scope

BUILD #010 hardens the public website intake channel introduced in BUILD #009.

It adds guardrails before a real embeddable script is shipped.

Implemented capabilities:

- optional widget token validation
- optional origin allowlist
- in-memory rate limiting
- stable public visitor id support
- public rate-limit metadata
- updated widget demo UI
- shared public Reception AI response contract

## Public endpoint

```http
POST /api/public/reception-ai/message
```

Request body:

```json
{
  "organizationSlug": "your-company-slug",
  "message": "Customer question",
  "customerName": "Optional name",
  "customerEmail": "Optional email",
  "conversationId": "Optional follow-up conversation id",
  "visitorId": "Stable anonymous visitor id",
  "widgetToken": "Optional public widget token",
  "websiteUrl": "https://customer-site.example"
}
```

## Environment configuration

```env
PUBLIC_WIDGET_TOKEN=""
PUBLIC_WIDGET_ALLOWED_ORIGINS="https://customer-site.example,https://www.customer-site.example"
PUBLIC_WIDGET_RATE_LIMIT_MAX=20
PUBLIC_WIDGET_RATE_LIMIT_WINDOW_SECONDS=60
```

Behavior:

- Empty `PUBLIC_WIDGET_TOKEN` disables token checks.
- Empty `PUBLIC_WIDGET_ALLOWED_ORIGINS` disables origin checks.
- Rate limiting defaults to `20` messages per `60` seconds.

## Guardrail behavior

### Widget token

When `PUBLIC_WIDGET_TOKEN` is configured, public widget requests must send the same value in `widgetToken`.

Invalid tokens return `401`.

### Origin allowlist

When `PUBLIC_WIDGET_ALLOWED_ORIGINS` is configured, request `Origin` must match one of the configured origins.

Invalid origins return `403`.

### Rate limiting

The API rate-limits public widget traffic by:

- organization slug
- visitor id when supplied
- IP fallback when visitor id is absent

Exceeded limits return `429`.

## UI

The `/widget-demo` page now includes:

- widget token field
- generated stable visitor id
- request metadata display
- rate-limit metadata display

## Validation

Expected CI commands:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next build

BUILD #011 should add the actual embeddable widget script:

- `/widget.js` script endpoint or static file
- organization slug configuration
- widget token wiring
- floating chat bubble
- iframe or DOM-mounted widget
- copy/paste embed snippet
