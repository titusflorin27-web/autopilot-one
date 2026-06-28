#!/usr/bin/env sh
set -eu

PROJECT_DIR="${PROJECT_DIR:-/opt/autopilot-one}"
BACKUP_DIR="${BACKUP_DIR:-/root/autopilot-backups/postgres}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
CRON_FILE="${CRON_FILE:-/etc/cron.d/autopilot-postgres-backup}"
CRON_SCHEDULE="${CRON_SCHEDULE:-17 3 * * *}"
LOG_FILE="${LOG_FILE:-/var/log/autopilot-postgres-backup.log}"

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

[ "$(id -u)" -eq 0 ] || fail "run as root"
[ -d "$PROJECT_DIR" ] || fail "project dir not found: $PROJECT_DIR"
[ -f "$PROJECT_DIR/scripts/vps-backup-postgres.sh" ] || fail "backup script not found"

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"
touch "$LOG_FILE"
chmod 600 "$LOG_FILE"

cat > "$CRON_FILE" <<EOF
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
$CRON_SCHEDULE root cd $PROJECT_DIR && BACKUP_DIR=$BACKUP_DIR RETENTION_DAYS=$RETENTION_DAYS sh scripts/vps-backup-postgres.sh >> $LOG_FILE 2>&1
EOF

chmod 644 "$CRON_FILE"

echo "Installed PostgreSQL backup cron: $CRON_FILE"
echo "Schedule: $CRON_SCHEDULE UTC/server time"
echo "Backup dir: $BACKUP_DIR"
echo "Retention days: $RETENTION_DAYS"
echo "Log file: $LOG_FILE"
