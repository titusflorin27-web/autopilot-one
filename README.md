# Autopilot One

AI-native Business Operating System for small and medium businesses.

## Current status

### Build #042 — Demo request email notification

Autopilot One is live on the production pilot domain with VPS Docker deployment, real dashboard metrics, public demo intake, demo request CRM workflow, widget analytics, and optional email notification for new demo requests.

Selected pilot domains:

- Web: `https://app.autopilot-one.com`
- API: `https://api.autopilot-one.com`

The product includes:

- Identity, login and organization workspaces
- Business DNA onboarding
- Knowledge Base ingestion and search
- Reception AI
- AI Gateway fallback support
- Public website intake
- Public demo request form
- Demo requests inbox and CRM Lite workflow
- Optional email notification for new demo requests
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
- Automated smoke tests
- VPS go-live checklist
- VPS deploy scripts
- Production pilot domain defaults
- Production widget install snippet defaults

## Release and pilot docs

- `docs/release-candidate.md`
- `docs/mvp-walkthrough.md`
- `docs/production-readiness.md`
- `docs/deployment-plan.md`
- `docs/deployment-templates.md`
- `docs/vps-docker-runbook.md`
- `docs/go-live-vps.md`
- `docs/pilot-readiness.md`
- `docs/builds/024-smoke-tests.md`
- `docs/builds/025-vps-target.md`
- `docs/builds/026-vps-scripts.md`
- `docs/builds/027-production-domain-update.md`
- `docs/builds/028-widget-domain-fix.md`

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
pnpm smoke:test
```

Then follow `docs/mvp-walkthrough.md`, `docs/pilot-readiness.md`, `docs/vps-docker-runbook.md` and `docs/go-live-vps.md`.

## VPS scripts

```bash
sh scripts/vps-preflight.sh
sh scripts/vps-deploy.sh
sh scripts/vps-healthcheck.sh
```

Public healthcheck after DNS and VPS deploy:

```bash
API_URL=https://api.autopilot-one.com/api/health APP_URL=https://app.autopilot-one.com sh scripts/vps-healthcheck.sh
```

## Optional demo request email notification

The public `/demo` form always saves incoming demo requests to the database. Email notification is optional and is enabled only when all of these API environment variables are present:

```bash
RESEND_API_KEY=...
DEMO_REQUEST_NOTIFICATION_TO=owner@example.com
DEMO_REQUEST_NOTIFICATION_FROM="Autopilot One <notifications@example.com>"
APP_PUBLIC_URL=https://app.autopilot-one.com
```

Do not commit real secrets. Configure them only in `apps/api/.env` on the target environment.

## Core app routes

- `/dashboard`
- `/demo`
- `/demo-requests`
- `/pricing`
- `/privacy`
- `/terms`
- `/refund-policy`
- `/consumer-rights`
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
GET /api/dashboard/metrics
GET /api/business-dna/:organizationId
PUT /api/business-dna
GET /api/knowledge-base/organization/:organizationId/sources
POST /api/knowledge-base/search
POST /api/reception-ai/message
GET /api/demo-requests
POST /api/demo-requests
PATCH /api/demo-requests/:id/status
PATCH /api/demo-requests/:id/crm
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
