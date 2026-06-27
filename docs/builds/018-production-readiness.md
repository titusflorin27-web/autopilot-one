# BUILD #018 — Production Readiness

Status: implemented on branch `codex/build-018-production-readiness`.

## Scope

BUILD #018 prepares Autopilot One for a more realistic deployment environment.

This build keeps the scope compact and focuses on runtime defaults, configuration and operator visibility.

## API runtime updates

`apps/api/src/main.ts` now includes:

- CORS configuration from `API_CORS_ORIGINS`
- credentials support for authenticated web requests
- basic security response headers
- request logging with method, path, status and duration
- startup log with API port

## Health endpoint

`GET /api/health` now returns:

- status
- service name
- version
- uptime seconds
- timestamp

## Env examples

`apps/api/.env.example` now includes:

- `NODE_ENV`
- `API_CORS_ORIGINS`
- public widget guardrail values

`apps/web/.env.example` now includes:

- `NEXT_PUBLIC_API_URL`
- `NEXT_PUBLIC_APP_URL`

## Production checklist

New document:

```text
docs/production-readiness.md
```

It covers:

- runtime env
- API secrets
- web app env
- AI Gateway
- public widget
- observability
- release steps

## Validation

Expected CI commands:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next build

BUILD #019 should add polish and demo flow:

- first-run checklist
- demo seed data
- guided flow from register to widget to lead
- dashboard launch checklist
- final MVP walkthrough docs
