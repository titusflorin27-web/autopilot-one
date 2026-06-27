# Deployment Plan

## Goal

Prepare Autopilot One MVP for a controlled private pilot.

This document defines the deployment shape, required services, environment values and rollout order.

## Selected pilot domains

Use these production pilot domains for the first VPS deployment:

- Web app: `https://app.autopilot-one.com`
- API app: `https://api.autopilot-one.com`
- API health: `https://api.autopilot-one.com/api/health`

## Recommended deployment shape

Use four runtime components:

1. Web app
2. API app
3. PostgreSQL database
4. Redis instance

The current repository already separates web and API apps inside the monorepo.

## Web app

Runtime:

- Node.js 20+
- pnpm 9+
- Next.js app from `apps/web`

Required env:

```env
NEXT_PUBLIC_API_URL=https://api.autopilot-one.com/api
NEXT_PUBLIC_APP_URL=https://app.autopilot-one.com
```

Build command:

```bash
pnpm install --frozen-lockfile=false
pnpm --filter @autopilot/web build
```

Start command:

```bash
pnpm --filter @autopilot/web start
```

## API app

Runtime:

- Node.js 20+
- pnpm 9+
- NestJS app from `apps/api`

Required env:

```env
NODE_ENV=production
DATABASE_URL=postgresql://...
REDIS_URL=redis://...
API_PORT=4000
API_CORS_ORIGINS=https://app.autopilot-one.com
JWT_ACCESS_SECRET=replace-with-long-random-value
JWT_ACCESS_TOKEN_TTL=15m
REFRESH_TOKEN_TTL_DAYS=30
PUBLIC_WIDGET_ALLOWED_ORIGINS=https://customer-site.example
PUBLIC_WIDGET_RATE_LIMIT_MAX=20
PUBLIC_WIDGET_RATE_LIMIT_WINDOW_SECONDS=60
```

Optional env:

```env
AI_GATEWAY_PROVIDER=openai
AI_GATEWAY_MODEL=gpt-4o-mini
AI_GATEWAY_BASE_URL=https://api.openai.com/v1
AI_GATEWAY_API_KEY=
PUBLIC_WIDGET_TOKEN=
```

Build command:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm --filter @autopilot/api build
```

Start command:

```bash
pnpm --filter @autopilot/api start
```

## Database

Use PostgreSQL.

Before first launch:

```bash
pnpm db:generate
pnpm db:migrate
```

For a pilot, keep database access limited to the API service and operational admins.

## Redis

Redis is already represented in local infrastructure and env configuration.

Pilot use:

- keep Redis available for future rate limit/session work
- do not expose Redis publicly

## Rollout order

1. Provision PostgreSQL.
2. Provision Redis.
3. Set API env values.
4. Deploy API.
5. Run database migration.
6. Verify `GET /api/health`.
7. Set web env values.
8. Deploy web.
9. Verify login and dashboard.
10. Configure first organization.
11. Configure widget settings.
12. Install widget on a test page.
13. Send a public test message.
14. Verify Inbox, Notifications and Launch Checklist.

## Go criteria

Proceed to private pilot only when:

- CI is green on `main`
- API health passes
- login works
- Business DNA can be saved
- Knowledge Base source can be added
- public widget message creates a conversation
- Inbox shows the conversation
- Notifications page loads
- Launch Checklist reaches pilot-ready state

## No-go criteria

Do not invite pilot users when:

- API health fails
- migrations are not applied
- login fails
- public widget endpoint fails
- Inbox cannot load conversations
- data is being written to the wrong environment
