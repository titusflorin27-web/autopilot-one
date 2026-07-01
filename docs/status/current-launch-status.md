# Autopilot One — Current launch status

This document is the operating checkpoint after BUILD #052 SEO launch polish.

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
- SEO metadata routes for public launch surface
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

### BUILD #047 — Launch status checkpoint

- Added this operational checkpoint document
- Saved validated baseline and remaining work
- Documentation-only build

### BUILD #048 — VPS security hardening

- Added read-only VPS security audit script
- Added controlled VPS security hardening script
- Added documentation for firewall/fail2ban/unattended-upgrades workflow
- Audit ran on the VPS
- Hardening ran on the VPS
- UFW firewall is active
- UFW default incoming policy is deny
- UFW default outgoing policy is allow
- UFW allows SSH `22/tcp`
- UFW allows HTTP `80/tcp`
- UFW allows HTTPS `443/tcp`
- UFW allows HTTP/3 `443/udp`
- fail2ban is active with the `sshd` jail active
- unattended-upgrades is active
- cron is active
- API and Web remained `HTTP/2 200` after hardening

### BUILD #049 — Monitoring and uptime checks

- Added local VPS monitoring check script
- Added local VPS monitoring cron installer
- Monitoring checks cover API, Web, Docker services, UFW, fail2ban, unattended-upgrades, cron, backup age, disk and memory
- Monitoring check ran successfully on the VPS with zero warnings
- Monitoring cron was installed at `/etc/cron.d/autopilot-monitoring`
- Monitoring schedule is every 5 minutes
- Monitoring status file is `/var/log/autopilot-monitoring-status.txt`
- Monitoring log file is `/var/log/autopilot-monitoring.log`
- Latest validated check confirmed API 200, Web 200, all Docker services running, security services active, recent PostgreSQL backup, healthy disk and memory usage
- This build adds local monitoring only; external alerting is still pending

### BUILD #050 — Off-server backups and restore test

- Added `rclone` installer script
- Added off-server backup sync script
- Added off-server backup cron installer
- Added non-destructive PostgreSQL backup verification script
- Added restore-test runbook for isolated restore environments
- No off-server credentials are stored in the repository

### BUILD #050B — Off-server backups validated on VPS

- Local backup verifier passed on the VPS with `pg_restore --list`
- `rclone` installed and configured on the VPS
- DigitalOcean Spaces private backup bucket configured outside the repository
- Dry-run off-server sync passed
- Real off-server sync passed
- Remote backup files are visible under `autopilot-one-backups/autopilot-one/postgres`
- `latest.txt` is present remotely and points to the latest dump file
- Off-server backup cron installed at `/etc/cron.d/autopilot-offsite-backup`
- Off-server backup schedule is daily at `03:47` server time
- Scheduled off-server cron run was confirmed with the next daily backup file
- `cron` service confirmed active
- Exposed setup keys were revoked; no secrets are stored in the repository

### BUILD #052 — SEO launch polish

- Added shared SEO metadata helper
- Added route-level canonical metadata for public pages
- Added Open Graph and Twitter metadata
- Added `robots.txt` metadata route
- Added `sitemap.xml` metadata route
- Added app manifest metadata route
- Added SVG app icons
- Added dynamic Open Graph image route
- Legal final copy remains intentionally deferred until company details and CAEN changes are finalized

## Current launch readiness verdict

Autopilot One is live and suitable for a controlled pilot.

The production VPS now has a basic hardening and monitoring layer: UFW, fail2ban, unattended security upgrades, cron backups, local monitoring, local PostgreSQL backups and off-server PostgreSQL backup sync are active.

The public web surface now has launch SEO metadata, robots and sitemap support. It is not yet considered ready for broad public launch or heavy paid traffic until a full restore test in a separate environment, external alerting, legal final polish and final QA are completed.

Estimated launch readiness: 92–94% after BUILD #052 validation.

## Remaining P0/P1 work

### P0

- Confirm that local monitoring cron continues to write fresh status reports
- Confirm that daily local backup runs successfully after the scheduled time
- Healthcheck after every security or infrastructure change
- Keep current firewall rules under review before changing SSH settings

### P1

- External uptime monitoring and alerting for API/Web
- Full restore test in a separate environment
- Backup failure alerting
- Legal final polish: GDPR, ANPC/SAL, refund/return policy, consumer rights, terms
- Public endpoint audit

### P2

- Redis-backed distributed rate limiting
- Stricter CSP after confirming it does not break Next.js/runtime behavior
- Email notification production polish
- Log rotation and disk usage monitoring
- UX polish for final launch
- SSH key-only access after key-based login is confirmed and tested

## Recommended next build order

1. BUILD #053 — Final Launch QA
2. BUILD #051 — Legal/ANPC/refund/GDPR final polish after company details and CAEN changes are ready
3. External alerting and full isolated restore test

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
- Do not change SSH settings until key-based access is confirmed and tested
- Do not expose Postgres or Redis publicly
- Do not store off-server backup credentials in the repository
