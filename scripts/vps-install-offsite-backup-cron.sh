#!/usr/bin/env sh
set -eu

PROJECT_DIR="${PROJECT_DIR:-/opt/autopilot-one}"
CRON_FILE="${CRON_FILE:-/etc/cron.d/autopilot-offsite-backup}"
CRON_SCHEDULE="${CRON_SCHEDULE:-47 3 * * *}"
LOG_FILE="${LOG_FILE:-/var/log/autopilot-offsite-backup.log}"
OFFSITE_REMOTE="${OFFSITE_REMOTE:-}"
BACKUP_DIR="${BACKUP_DIR:-/root/autopilot-backups/postgres}"

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

[ "$(id -u)" -eq 0 ] || fail "run as root"
[ -d "$PROJECT_DIR" ] || fail "project dir not found: $PROJECT_DIR"
[ -f "$PROJECT_DIR/scripts/vps-sync-backups-offsite.sh" ] || fail "offsite sync script not found"
[ -n "$OFFSITE_REMOTE" ] || fail "OFFSITE_REMOTE is required"

mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"
chmod 600 "$LOG_FILE"

cat > "$CRON_FILE" <<EOF
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
$CRON_SCHEDULE root cd $PROJECT_DIR && BACKUP_DIR=$BACKUP_DIR OFFSITE_REMOTE=$OFFSITE_REMOTE LOG_FILE=$LOG_FILE sh scripts/vps-sync-backups-offsite.sh >> $LOG_FILE 2>&1
EOF

chmod 644 "$CRON_FILE"

echo "Installed Autopilot off-server backup cron: $CRON_FILE"
echo "Schedule: $CRON_SCHEDULE"
echo "Project dir: $PROJECT_DIR"
echo "Backup dir: $BACKUP_DIR"
echo "Offsite remote: $OFFSITE_REMOTE"
echo "Log file: $LOG_FILE"
