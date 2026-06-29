# BUILD #049 — Monitoring and uptime checks

## Goal

Add a lightweight VPS monitoring workflow for the Autopilot One production pilot.

## Scope

This build adds scripts and documentation only.

It does not change:

- API runtime behavior
- Web runtime behavior
- Database schema
- Widget token behavior
- Auth behavior
- CRM behavior
- Environment files
- Secrets

## Files

- `scripts/vps-monitoring-check.sh`
- `scripts/vps-install-monitoring-cron.sh`
- `docs/builds/049-monitoring-uptime-checks.md`

## Manual monitoring check

Run from `/opt/autopilot-one`:

```bash
sh scripts/vps-monitoring-check.sh
```

The script checks:

- API health endpoint
- Web app URL
- Docker Compose services: `postgres`, `redis`, `proxy`, `api`, `web`
- `cron`
- `fail2ban`
- `unattended-upgrades`
- UFW active status
- latest PostgreSQL backup age and size
- root disk usage
- memory usage

Default thresholds:

- latest backup maximum age: 36 hours
- root disk warning: 85%
- memory warning: 90%

The script writes the latest status report to:

```text
/var/log/autopilot-monitoring-status.txt
```

It exits with code `0` when there are no failures. It exits with code `1` when a critical check fails.

## Install periodic monitoring cron

Run as root from `/opt/autopilot-one`:

```bash
sh scripts/vps-install-monitoring-cron.sh
```

Default schedule:

```text
*/5 * * * *
```

Default log file:

```text
/var/log/autopilot-monitoring.log
```

Default status file:

```text
/var/log/autopilot-monitoring-status.txt
```

## Validate installation

```bash
cat /etc/cron.d/autopilot-monitoring
tail -n 120 /var/log/autopilot-monitoring.log
cat /var/log/autopilot-monitoring-status.txt
```

## Notes

This is local VPS monitoring. It does not yet send external alerts.

The next recommended step is external uptime monitoring and off-server backups, so issues are visible even if the VPS becomes unreachable.
