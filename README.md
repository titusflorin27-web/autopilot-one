# Autopilot One

AI-native Business Operating System for small and medium businesses.

## Current status

### Build #050 — Off-server backups and restore test

Autopilot One is live on the production pilot domain with VPS Docker deployment, real dashboard metrics, public demo intake, demo request CRM workflow, widget analytics, optional email notification for new demo requests, application-level security hardening, VPS PostgreSQL backup scripts, controlled VPS security hardening, local VPS monitoring scripts, and off-server backup sync scripts.

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
- Public website launch polish
- API and web security headers
- Rate limits for public intake, widget, and auth endpoints
- VPS PostgreSQL backup and restore scripts
- Daily backup cron installer
- VPS security audit and hardening scripts
- VPS monitoring and uptime check scripts
- Off-server backup sync scripts

## Release and pilot docs

- `docs/release-candidate.md`
- `docs/mvp-walkthrough.md`
- `docs/production-readiness.md`
- `docs/deployment-plan.md`
- `docs/deployment-templates.md`
- `docs/vps-docker-runbook.md`
- `docs/go-live-vps.md`
- `docs/pilot-readiness.md`
- `docs/status/current-launch-status.md`
- `docs/builds/024-smoke-tests.md`
- `docs/builds/025-vps-target.md`
- `docs/builds/026-vps-scripts.md`
- `docs/builds/027-production-domain-update.md`
- `docs/builds/028-widget-domain-fix.md`
- `docs/builds/046-postgres-backups.md`
- `docs/builds/047-launch-status-checkpoint.md`
- `docs/builds/048-vps-security-hardening.md`
- `docs/builds/049-monitoring-uptime-checks.md`
- `docs/builds/050-offserver-backups-restore-test.md`

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
sh scripts/vps-backup-postgres.sh
sh scripts/vps-install-backup-cron.sh
sh scripts/vps-security-audit.sh
sh scripts/vps-security-hardening.sh
sh scripts/vps-monitoring-check.sh
sh scripts/vps-install-monitoring-cron.sh
sh scripts/vps-install-rclone.sh
sh scripts/vps-verify-postgres-backup.sh
sh scripts/vps-sync-backups-offsite.sh
sh scripts/vps-install-offsite-backup-cron.sh
```

Public healthcheck after DNS and VPS deploy:

```bash
API_URL=https://api.autopilot-one.com/api/health APP_URL=https://app.autopilot-one.com sh scripts/vps-healthcheck.sh
```

## VPS PostgreSQL backups

Manual backup from `/opt/autopilot-one`:

```bash
sh scripts/vps-backup-postgres.sh
```

Install daily backup cron as root:

```bash
sh scripts/vps-install-backup-cron.sh
```

Default backup location:

```text
/root/autopilot-backups/postgres
```

Default retention: 14 days. Restore instructions are documented in `docs/builds/046-postgres-backups.md`.

## VPS security hardening

Read-only audit from `/opt/autopilot-one`:

```bash
sh scripts/vps-security-audit.sh
```

Prepare security packages and firewall rules without enabling firewall:

```bash
sh scripts/vps-security-hardening.sh
```

Enable firewall only after confirming SSH access in a second session:

```bash
ENABLE_FIREWALL=YES sh scripts/vps-security-hardening.sh
```

Full instructions are documented in `docs/builds/048-vps-security-hardening.md`.

## VPS monitoring

Manual monitoring check from `/opt/autopilot-one`:

```bash
sh scripts/vps-monitoring-check.sh
```

Install local monitoring cron as root:

```bash
sh scripts/vps-install-monitoring-cron.sh
```

Default log file:

```text
/var/log/autopilot-monitoring.log
```

Default status file:

```text
/var/log/autopilot-monitoring-status.txt
```

Full instructions are documented in `docs/builds/049-monitoring-uptime-checks.md`.

## Off-server backups

Install rclone:

```bash
sh scripts/vps-install-rclone.sh
```

Configure a private remote on the VPS:

```bash
rclone config
```

Verify the latest local backup without restoring it:

```bash
sh scripts/vps-verify-postgres-backup.sh
```

Run a dry-run sync:

```bash
DRY_RUN=YES OFFSITE_REMOTE=autopilot-offsite:autopilot-one/postgres sh scripts/vps-sync-backups-offsite.sh
```

Run a real sync:

```bash
OFFSITE_REMOTE=autopilot-offsite:autopilot-one/postgres sh scripts/vps-sync-backups-offsite.sh
```

Install the off-server backup cron after manual sync succeeds:

```bash
OFFSITE_REMOTE=autopilot-offsite:autopilot-one/postgres sh scripts/vps-install-offsite-backup-cron.sh
```

Full instructions are documented in `docs/builds/050-offserver-backups-restore-test.md`.

## Security configuration

The API applies a default body limit of `256kb`, strict production CORS defaults, security headers, and endpoint-level rate limits. Production deployments can override these values through environment variables:

```bash
API_BODY_LIMIT=256kb
API_CORS_ORIGINS=https://app.autopilot-one.com,https://autopilot-one.com,https://www.autopilot-one.com
```

When adding a new customer domain for the embedded widget, add the same origin to the organization widget allowed origins and to `API_CORS_ORIGINS` before public launch on that domain.

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
