# BUILD #053 — Final Launch QA

## Goal

Add a repeatable VPS-side final launch QA check that confirms the production pilot environment is healthy after the launch-hardening work.

## Scope

This build adds a non-destructive QA script and documentation.

It does not change:

- API runtime behavior
- Web runtime behavior
- Database schema
- Authentication behavior
- Widget token behavior
- Backup creation or restore behavior
- VPS secrets or environment files
- Legal copy

## Added script

```bash
scripts/vps-final-launch-qa.sh
```

The script checks:

- public app homepage
- public pricing/demo/trust pages
- SEO metadata routes: `robots.txt`, `sitemap.xml`, `opengraph-image`, `icon.svg`, `manifest.webmanifest`
- API health response
- Docker services: `postgres`, `redis`, `proxy`, `api`, `web`
- host services: `cron`, `fail2ban`, `unattended-upgrades`, `ufw`
- local monitoring status freshness
- local PostgreSQL backup freshness
- off-server backup marker and latest dump object
- disk and memory usage

## Runbook

From the VPS project directory:

```bash
cd /opt/autopilot-one
sh scripts/vps-final-launch-qa.sh
```

Optional overrides:

```bash
COMPOSE_FILE=infrastructure/docker-compose.vps.example.yml \
APP_URL=https://app.autopilot-one.com \
API_URL=https://api.autopilot-one.com/api/health \
BACKUP_DIR=/root/autopilot-backups/postgres \
OFFSITE_REMOTE=autopilot-offsite:autopilot-one-backups/autopilot-one/postgres \
sh scripts/vps-final-launch-qa.sh
```

The script writes a local report to:

```text
/var/log/autopilot-final-launch-qa.txt
```

## Expected result

The script should exit with code `0` and print:

```text
OK: Final launch QA passed with 0 warning(s)
```

A small number of warnings may be acceptable depending on disk/memory levels, but failures should be fixed before broader launch.

## Notes

- This script is read-only for production services.
- It does not run migrations.
- It does not restore databases.
- It does not mutate off-server backups.
- It does not print secrets.

## Remaining launch work

After BUILD #053 is validated on the VPS, remaining work before broader public launch is:

- legal/GDPR/ANPC/refund final polish after company details and CAEN update are ready
- external uptime monitoring and alerting
- backup failure alerting
- full restore test in a separate environment
