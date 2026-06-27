# Autopilot One

AI-native Business Operating System for small and medium businesses.

## Current status

### Build #023 — Deployment Runbook

Autopilot One is at MVP Release Candidate stage and now includes Docker deployment templates plus an operational runbook.

The product includes:

- Identity, login and organization workspaces
- Business DNA onboarding
- Knowledge Base ingestion and search
- Reception AI
- AI Gateway fallback support
- Public website intake
- Embeddable website widget
- Widget settings and runtime controls
- Widget analytics and install health
- Unified Inbox
- Notification Center
- Plans and usage limits
- Launch Checklist
- Production readiness checklist
- Deployment plan
- Pilot readiness checklist
- Docker deploy files
- VPS Docker runbook

## Release and pilot docs

- `docs/release-candidate.md`
- `docs/mvp-walkthrough.md`
- `docs/production-readiness.md`
- `docs/deployment-plan.md`
- `docs/deployment-templates.md`
- `docs/vps-docker-runbook.md`
- `docs/pilot-readiness.md`

## Requirements

- Node.js 20+
- pnpm 9+
- Docker Desktop

## Local development

```bash
pnpm install
docker compose -f infrastructure/docker-compose.yml up -d
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Web: http://localhost:3000  
API health: http://localhost:4000/api/health

## Release candidate validation

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

Then follow `docs/mvp-walkthrough.md`, `docs/pilot-readiness.md` and `docs/vps-docker-runbook.md`.

## Core app routes

- `/dashboard`
- `/launch`
- `/onboarding`
- `/knowledge-base`
- `/reception-ai`
- `/widget-demo`
- `/widget-settings`
- `/widget-analytics`
- `/inbox`
- `/notifications`
- `/billing`

## Core API routes

```http
GET /api/health
POST /api/auth/register
POST /api/auth/login
GET /api/users/me
GET /api/business-dna/:organizationId
PUT /api/business-dna
GET /api/knowledge-base/organization/:organizationId/sources
POST /api/knowledge-base/search
POST /api/reception-ai/message
GET /api/inbox/organization/:organizationId/conversations
GET /api/notifications/organization/:organizationId
GET /api/billing/organization/:organizationId
GET /api/launch/organization/:organizationId/checklist
GET /api/public/reception-ai/widget/:organizationSlug/config
POST /api/public/reception-ai/message
```

Protected requests use:

```http
Authorization: Bearer <accessToken>
```
