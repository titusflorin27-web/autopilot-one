#!/usr/bin/env sh
set -eu

PROJECT_DIR="${PROJECT_DIR:-/opt/autopilot-one}"
CRON_FILE="${CRON_FILE:-/etc/cron.d/autopilot-monitoring}"
CRON_SCHEDULE="${CRON_SCHEDULE:-*/5 * * * *}"
LOG_FILE="${LOG_FILE:-/var/log/autopilot-monitoring.log}"
STATUS_FILE="${STATUS_FILE:-/var/log/autopilot-monitoring-status.txt}"

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

[ "$(id -u)" -eq 0 ] || fail "run as root"
[ -d "$PROJECT_DIR" ] || fail "project dir not found: $PROJECT_DIR"
[ -f "$PROJECT_DIR/scripts/vps-monitoring-check.sh" ] || fail "monitoring check script not found"

mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE" "$STATUS_FILE"
chmod 600 "$LOG_FILE" "$STATUS_FILE"

cat > "$CRON_FILE" <<EOF
SHELL=/bin/sh
PATH=/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin
$CRON_SCHEDULE root cd $PROJECT_DIR && STATUS_FILE=$STATUS_FILE sh scripts/vps-monitoring-check.sh >> $LOG_FILE 2>&1
EOF

chmod 644 "$CRON_FILE"

echo "Installed Autopilot monitoring cron: $CRON_FILE"
echo "Schedule: $CRON_SCHEDULE"
echo "Project dir: $PROJECT_DIR"
echo "Log file: $LOG_FILE"
echo "Status file: $STATUS_FILE"
