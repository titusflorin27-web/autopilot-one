# BUILD #012 — Widget Settings / Install Manager

Status: implemented on branch `codex/build-012-widget-settings`.

## Scope

BUILD #012 adds organization-level management for the embeddable Reception AI widget.

The widget can now be configured from the product instead of requiring manual snippet editing.

## Data model updates

`Organization` now includes:

- `widgetEnabled`
- `widgetTitle`
- `widgetPrimaryColor`
- `widgetPosition`
- `widgetToken`
- `widgetAllowedOrigins`

`WidgetPosition` supports:

- `LEFT`
- `RIGHT`

## API endpoints

Protected endpoints:

```http
GET /api/organizations/:id/widget-settings
PATCH /api/organizations/:id/widget-settings
POST /api/organizations/:id/widget-settings/token
```

Access rules:

- OWNER, ADMIN and MEMBER can read widget settings.
- OWNER and ADMIN can update widget settings.
- OWNER and ADMIN can regenerate widget tokens.

## UI

The new UI lives at:

```http
/widget-settings
```

It supports:

- enable/disable widget
- edit widget title
- edit primary color
- choose left/right widget position
- edit widget token
- regenerate widget token
- edit allowed origins, one per line
- view install snippet
- copy install snippet to clipboard

## Shared contract

`@autopilot/shared` now exports:

```ts
type WidgetPosition = "LEFT" | "RIGHT";

interface WidgetSettings {
  id: ID;
  name: string;
  slug: string;
  widgetEnabled: boolean;
  widgetTitle: string;
  widgetPrimaryColor: string;
  widgetPosition: WidgetPosition;
  widgetToken?: string | null;
  widgetAllowedOrigins: string[];
  installSnippet: string;
}
```

## Validation

Expected CI commands:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next build

BUILD #013 should connect organization widget settings directly into the public widget runtime:

- enforce per-organization widget enabled state
- enforce per-organization widget token
- enforce per-organization allowed origins
- expose public widget configuration endpoint
- make `/autopilot-widget.js` support color and position from settings
