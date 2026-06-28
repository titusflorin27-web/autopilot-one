# BUILD #046 — PostgreSQL backups

## Goal

Add a safe VPS backup workflow for the production PostgreSQL database used by Autopilot One.

## Files

- `scripts/vps-backup-postgres.sh`
- `scripts/vps-restore-postgres.sh`
- `scripts/vps-install-backup-cron.sh`

## Backup command

Run from `/opt/autopilot-one`:

```bash
sh scripts/vps-backup-postgres.sh
```

Default behavior:

- writes backups to `/root/autopilot-backups/postgres`
- creates custom-format PostgreSQL dumps: `autopilot_postgres_YYYYMMDDTHHMMSSZ.dump`
- maintains `latest.dump` symlink
- keeps backups for 14 days by default
- sets backup directory permission to `700`
- sets backup file permission to `600`

Optional overrides:

```bash
BACKUP_DIR=/root/autopilot-backups/postgres RETENTION_DAYS=14 sh scripts/vps-backup-postgres.sh
```

## Install automatic daily backup

Run as root from `/opt/autopilot-one`:

```bash
sh scripts/vps-install-backup-cron.sh
```

Default cron schedule:

```text
17 3 * * *
```

This means one backup every day at 03:17 server time.

Default log file:

```text
/var/log/autopilot-postgres-backup.log
```

Check cron entry:

```bash
cat /etc/cron.d/autopilot-postgres-backup
```

Check latest log:

```bash
tail -n 80 /var/log/autopilot-postgres-backup.log
```

## Manual restore

Restores can overwrite production data. Stop API and Web before restore:

```bash
cd /opt/autopilot-one
docker compose -f infrastructure/docker-compose.vps.example.yml stop api web
CONFIRM_RESTORE=YES sh scripts/vps-restore-postgres.sh /root/autopilot-backups/postgres/latest.dump
docker compose -f infrastructure/docker-compose.vps.example.yml up -d api web
curl -i https://api.autopilot-one.com/api/health
curl -I https://app.autopilot-one.com
```

## Notes

The backup is local to the VPS. For a later hardening build, add off-server backup storage so a full VPS loss does not destroy every backup copy.
