# BUILD #028 — Widget Domain Fix

Status: implemented on branch `codex/build-028-widget-domain-fix`.

## Scope

BUILD #028 fixes the production widget install snippet generated from Widget Settings.

During strict deploy review, the generated install snippet still used placeholder hosts:

- `https://your-autopilot-web-host.example`
- `https://your-autopilot-api-host.example/api`

This would make the copied customer widget snippet incorrect for the `autopilot-one.com` pilot deployment.

## Fixed behavior

Widget Settings now generates install snippets using production defaults:

- Web asset host: `https://app.autopilot-one.com`
- API URL: `https://api.autopilot-one.com/api`
- Public config endpoint: `https://api.autopilot-one.com/api/public/reception-ai/widget/:organizationSlug/config`

The runtime can still override these with environment variables if needed:

```env
PUBLIC_APP_URL=https://app.autopilot-one.com
PUBLIC_API_URL=https://api.autopilot-one.com/api
```

## Updated files

- `apps/api/src/modules/organizations/organizations.service.ts`
- `README.md`
- `docs/builds/028-widget-domain-fix.md`

## Validation

CI should run:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
pnpm smoke:test
```

## Deploy note

During VPS deploy, still set API CORS manually in `apps/api/.env`:

```env
API_CORS_ORIGINS=https://app.autopilot-one.com
```

`apps/api/.env.production.example` still contains a generic placeholder and must not be copied without editing.
