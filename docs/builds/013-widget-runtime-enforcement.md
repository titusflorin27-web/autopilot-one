# BUILD #013 — Widget Runtime Enforcement

Status: implemented on branch `codex/build-013-widget-runtime-enforcement`.

## Scope

BUILD #013 connects organization widget settings to the public widget runtime.

BUILD #012 stored widget settings and exposed the install manager. This build makes those settings operational.

## Public config endpoint

```http
GET /api/public/reception-ai/widget/:organizationSlug/config
```

Returns runtime-safe widget configuration:

```json
{
  "organizationSlug": "your-company-slug",
  "widgetEnabled": true,
  "title": "Reception AI",
  "primaryColor": "#8ee6c9",
  "position": "RIGHT",
  "rateLimit": {
    "windowSeconds": 60,
    "max": 20
  }
}
```

The endpoint intentionally does not expose widget tokens or internal organization ids.

## Runtime enforcement

The public message endpoint now enforces organization settings:

- inactive organizations are blocked
- disabled widgets are blocked
- per-organization widget token is enforced when configured
- per-organization allowed origins are enforced when configured
- global env token/origin settings remain fallback defaults
- rate limiting still applies per organization/visitor

## Widget script

`/autopilot-widget.js` now:

1. Calls the public config endpoint before rendering.
2. Does not render if the widget is disabled or unavailable.
3. Applies runtime title.
4. Applies runtime primary color.
5. Applies left/right runtime position.
6. Continues sending visitor id, conversation id and widget token to the public message endpoint.

## UI

`/widget-settings` now displays:

- the public config endpoint
- runtime install context
- the generated install snippet

## Shared contract

`@autopilot/shared` now exports `PublicWidgetConfig` and includes `publicConfigEndpoint` in `WidgetSettings`.

## Validation

Expected CI commands:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next build

BUILD #014 should add public widget observability:

- widget install health check
- public message analytics
- public channel conversion metrics
- widget events dashboard
- source site/domain reporting
