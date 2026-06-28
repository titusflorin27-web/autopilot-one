# Autopilot One — Current launch status

This document is the operating checkpoint after BUILD #046.

No secrets, API keys, passwords or widget tokens are stored here.

## Live environment

- Repository: `titusflorin27-web/autopilot-one`
- Main branch: `main`
- Production app: `https://app.autopilot-one.com`
- Production API: `https://api.autopilot-one.com`
- API health: `https://api.autopilot-one.com/api/health`
- VPS project path: `/opt/autopilot-one`
- VPS compose file: `infrastructure/docker-compose.vps.example.yml`
- Reverse proxy: Caddy in Docker Compose
- Runtime services: Postgres, Redis, Caddy proxy, API, Web

## Confirmed production status

- API health: `HTTP/2 200`
- Web: `HTTP/2 200`
- Prisma migrations: no pending migrations
- Containers: API, Web, Proxy, Postgres and Redis running
- Public app is live on the production pilot domain

## Validated product areas

- Public homepage
- Pricing page
- Demo request page
- Public demo form
- Demo request CRM page
- CRM Lite fields: internal note, next step, follow-up date
- Dashboard metrics based on real product activity
- Widget settings
- Widget demo
- Widget analytics
- Reception AI public widget response
- Public widget event tracking
- Auth/login
- API health
- Web health

## Validated widget behavior

- Widget token is masked in UI
- Production snippet copies the real token without exposing it visually
- Widget demo works when the real token is provided locally by the operator
- Widget event analytics show `MESSAGE_SENT` and `MESSAGE_RECEIVED`
- Do not post widget tokens in chat, screenshots or docs
- Do not regenerate the widget token without a clear reason

## Validated demo request behavior

- Public `/demo` form saves requests to the database
- New demo requests appear in `/demo-requests`
- Request status can be changed
- CRM Lite details are saved and shown
- Dashboard reflects demo request activity

## Validated builds

### BUILD #031 — Persist VPS hotfixes

- Public Reception AI DTO accepts both visitor/customer name/email variants
- Widget demo and Knowledge Base reset/null errors fixed
- Widget domains use production domains instead of localhost
- Shared dependency typecheck fixed

### BUILD #032 — Production polish and trust pages

- More professional Romanian homepage
- Pricing page added
- Privacy page added
- Terms page added
- Refund policy page added
- Consumer rights page added
- Navigation updated
- Widget token masked in UI/snippet display
- Snippet copy copies the real production fragment

### BUILD #033–#043 — Product and launch polish

- Demo request persistence
- Demo request CRM page
- Dashboard real metrics
- Widget analytics
- Public site commercial polish
- Pricing and demo funnel polish
- CRM Lite interactions
- Launch readiness improvements

### BUILD #044 — App security hardening

- API body size limit
- Stricter CORS defaults
- API security headers
- Web security headers
- Rate limits for auth, demo form and public widget endpoints
- URL log redaction for sensitive query parameters

### BUILD #044A — API Express runtime dependency hotfix

- Added explicit API runtime dependency on `express`
- Fixed production API startup error: `Cannot find module 'express'`

### BUILD #045 — Security header polish

- Removed `x-powered-by: Express`
- Removed `x-powered-by: Next.js`
- API and Web continue to return `HTTP/2 200`

### BUILD #046 — PostgreSQL backups

- Added manual PostgreSQL backup script
- Added guarded restore script
- Added daily cron installer
- Manual backup validated on VPS
- Cron installed and cron service confirmed active
- Backup directory: `/root/autopilot-backups/postgres`
- Backup retention: 14 days
- Default schedule: daily at 03:17 server time
- Backup log: `/var/log/autopilot-postgres-backup.log`

## Current launch readiness verdict

Autopilot One is live and suitable for a controlled pilot.

It is not yet considered ready for broad public launch or heavy paid traffic until the remaining hardening items are completed.

Estimated launch readiness: 75–80%.

## Remaining P0/P1 work

### P0

- VPS Security Hardening: firewall, fail2ban, SSH checks, unattended security updates
- Confirm that daily backup runs successfully after the scheduled time
- Healthcheck after every security or infrastructure change

### P1

- Off-server backup storage
- Restore test in a separate environment
- Uptime monitoring and alerting for API/Web
- Backup failure alerting
- Legal final polish: GDPR, ANPC/SAL, refund/return policy, consumer rights, terms
- SEO technical launch: robots.txt, sitemap.xml, canonical URLs, Open Graph metadata, favicon/app icons
- Public endpoint audit

### P2

- Redis-backed distributed rate limiting
- Stricter CSP after confirming it does not break Next.js/runtime behavior
- Email notification production polish
- Log rotation and disk usage monitoring
- UX polish for final launch

## Recommended next build order

1. BUILD #048 — VPS Security Hardening
2. BUILD #049 — Monitoring and uptime checks
3. BUILD #050 — Off-server backups and restore test
4. BUILD #051 — Legal/ANPC/refund/GDPR final polish
5. BUILD #052 — SEO, sitemap, robots and metadata
6. BUILD #053 — Final Launch QA

## Standard safe VPS deploy pattern

Always back up environment files before pulling code:

```bash
cd /opt/autopilot-one
mkdir -p /root/autopilot-backup
cp infrastructure/docker-compose.vps.example.yml /root/autopilot-backup/docker-compose.vps.example.yml
cp apps/api/.env /root/autopilot-backup/api.env
cp apps/web/.env.local /root/autopilot-backup/web.env.local

git fetch origin main
git reset --hard origin/main

cp /root/autopilot-backup/docker-compose.vps.example.yml infrastructure/docker-compose.vps.example.yml
cp /root/autopilot-backup/api.env apps/api/.env
cp /root/autopilot-backup/web.env.local apps/web/.env.local

sh scripts/vps-preflight.sh
docker compose -f infrastructure/docker-compose.vps.example.yml up -d --build
docker compose -f infrastructure/docker-compose.vps.example.yml exec -T api pnpm --filter @autopilot/api prisma:migrate
curl -i https://api.autopilot-one.com/api/health
curl -I https://app.autopilot-one.com
```

## Operational rules

- Never commit or paste secrets, API keys, database passwords or widget tokens
- Never regenerate the widget token without a clear reason
- Do not run destructive restore commands without `CONFIRM_RESTORE=YES` and an explicit operator decision
- Do not enable firewall rules until SSH access has been verified and the allow rules are in place
