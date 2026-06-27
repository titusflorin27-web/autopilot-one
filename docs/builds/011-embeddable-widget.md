# BUILD #011 — Embeddable Website Widget

Status: implemented on branch `codex/build-011-embeddable-widget`.

## Scope

BUILD #011 ships the first real embeddable Reception AI widget.

Before this build, the product had:

- a public Reception AI endpoint
- public channel hardening
- a `/widget-demo` internal demo page

This build adds a static script that can be installed on external websites.

## Widget script

The script is served by the web app at:

```http
GET /autopilot-widget.js
```

In the repository, it lives at:

```text
apps/web/public/autopilot-widget.js
```

## Embed snippet

Production-style snippet:

```html
<script
  src="https://your-autopilot-web-host.example/autopilot-widget.js"
  data-organization-slug="your-company-slug"
  data-api-url="https://your-autopilot-api-host.example/api"
  data-title="Reception AI"
  data-widget-token="optional-public-widget-token"
  async
></script>
```

Local development snippet:

```html
<script
  src="http://localhost:3000/autopilot-widget.js"
  data-organization-slug="your-company-slug"
  data-api-url="http://localhost:4000/api"
  data-title="Reception AI"
  async
></script>
```

## Supported script attributes

- `data-organization-slug`
- `data-api-url`
- `data-title`
- `data-widget-token`

## Widget behavior

The widget:

1. Reads configuration from script `data-*` attributes.
2. Creates a floating `AI` chat bubble.
3. Opens a compact chat panel.
4. Creates a stable anonymous visitor id in browser storage.
5. Persists the public conversation id in browser storage.
6. Sends messages to `POST /api/public/reception-ai/message`.
7. Displays the Reception AI response.
8. Continues the same public conversation across messages.

## Public API integration

The widget calls:

```http
POST /api/public/reception-ai/message
```

With:

```json
{
  "organizationSlug": "your-company-slug",
  "message": "Customer message",
  "conversationId": "Existing public conversation id, if available",
  "visitorId": "Stable anonymous visitor id",
  "widgetToken": "Optional public widget token",
  "websiteUrl": "Current browser URL"
}
```

## Demo page

The `/widget-demo` page now shows:

- the public API simulator
- the real embed snippet
- configurable organization slug
- optional widget token
- the public API contract

## Validation

Expected CI commands:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next build

BUILD #012 should add widget settings and installation management inside the product UI:

- organization-level widget settings
- generated widget token
- allowed domains per organization
- copy-to-clipboard install snippet
- enable/disable widget per organization
