#!/usr/bin/env sh
set -eu

COMPOSE_FILE="${COMPOSE_FILE:-infrastructure/docker-compose.vps.example.yml}"
API_URL="${API_URL:-https://api.autopilot-one.com/api/health}"
APP_URL="${APP_URL:-https://app.autopilot-one.com}"
BACKUP_DIR="${BACKUP_DIR:-/root/autopilot-backups/postgres}"
MAX_BACKUP_AGE_HOURS="${MAX_BACKUP_AGE_HOURS:-36}"
DISK_WARN_PERCENT="${DISK_WARN_PERCENT:-85}"
MEM_WARN_PERCENT="${MEM_WARN_PERCENT:-90}"
STATUS_FILE="${STATUS_FILE:-/var/log/autopilot-monitoring-status.txt}"

FAILURES=0
WARNINGS=0
REPORT=""

add_line() {
  REPORT="$REPORT$1
"
  echo "$1"
}

ok() {
  add_line "OK: $1"
}

warn() {
  WARNINGS=$((WARNINGS + 1))
  add_line "WARN: $1"
}

fail() {
  FAILURES=$((FAILURES + 1))
  add_line "FAIL: $1"
}

section() {
  add_line ""
  add_line "=== $1 ==="
}

http_status() {
  curl -fsS -o /dev/null -w '%{http_code}' --max-time 15 "$1" 2>/dev/null || echo "000"
}

check_systemd_active() {
  service_name="$1"
  label="$2"
  if systemctl is-active --quiet "$service_name"; then
    ok "$label is active"
  else
    fail "$label is not active"
  fi
}

check_docker_service() {
  service_name="$1"
  if docker compose -f "$COMPOSE_FILE" ps --status running --services 2>/dev/null | grep -qx "$service_name"; then
    ok "Docker service running: $service_name"
  else
    fail "Docker service not running: $service_name"
  fi
}

section "Autopilot One monitoring check"
add_line "Timestamp UTC: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
add_line "Host: $(hostname)"

section "HTTP health"
API_STATUS="$(http_status "$API_URL")"
APP_STATUS="$(http_status "$APP_URL")"
case "$API_STATUS" in
  2*) ok "API reachable: $API_STATUS $API_URL" ;;
  *) fail "API unhealthy: $API_STATUS $API_URL" ;;
esac
case "$APP_STATUS" in
  2*|3*) ok "Web reachable: $APP_STATUS $APP_URL" ;;
  *) fail "Web unhealthy: $APP_STATUS $APP_URL" ;;
esac

section "Docker services"
if [ -f "$COMPOSE_FILE" ]; then
  for service in postgres redis proxy api web; do
    check_docker_service "$service"
  done
else
  fail "Compose file missing: $COMPOSE_FILE"
fi

section "Host security services"
check_systemd_active cron "cron"
check_systemd_active fail2ban "fail2ban"
check_systemd_active unattended-upgrades "unattended-upgrades"
if command -v ufw >/dev/null 2>&1; then
  if ufw status | grep -q '^Status: active'; then
    ok "UFW firewall is active"
  else
    fail "UFW firewall is not active"
  fi
else
  fail "ufw is not installed"
fi

section "PostgreSQL backups"
LATEST_BACKUP=""
if [ -L "$BACKUP_DIR/latest.dump" ] || [ -f "$BACKUP_DIR/latest.dump" ]; then
  LATEST_BACKUP="$BACKUP_DIR/latest.dump"
elif [ -d "$BACKUP_DIR" ]; then
  LATEST_BACKUP="$(find "$BACKUP_DIR" -type f -name 'autopilot_postgres_*.dump' -printf '%T@ %p\n' 2>/dev/null | sort -nr | awk 'NR == 1 { print $2 }')"
fi

if [ -n "$LATEST_BACKUP" ] && [ -s "$LATEST_BACKUP" ]; then
  NOW_SECONDS="$(date +%s)"
  BACKUP_SECONDS="$(stat -c %Y "$LATEST_BACKUP")"
  AGE_HOURS="$(( (NOW_SECONDS - BACKUP_SECONDS) / 3600 ))"
  BACKUP_SIZE="$(du -h "$LATEST_BACKUP" | awk '{print $1}')"
  if [ "$AGE_HOURS" -le "$MAX_BACKUP_AGE_HOURS" ]; then
    ok "Latest backup is recent: ${AGE_HOURS}h old, size $BACKUP_SIZE"
  else
    fail "Latest backup is too old: ${AGE_HOURS}h old, max ${MAX_BACKUP_AGE_HOURS}h"
  fi
else
  fail "No usable PostgreSQL backup found in $BACKUP_DIR"
fi

section "Disk and memory"
ROOT_USAGE="$(df -P / | awk 'NR == 2 { gsub("%", "", $5); print $5 }')"
if [ -n "$ROOT_USAGE" ] && [ "$ROOT_USAGE" -lt "$DISK_WARN_PERCENT" ]; then
  ok "Root disk usage is ${ROOT_USAGE}%"
else
  warn "Root disk usage is ${ROOT_USAGE}%"
fi

MEM_PERCENT="$(free | awk '/Mem:/ { if ($2 > 0) printf "%d", ($3 / $2) * 100; else print 0 }')"
if [ -n "$MEM_PERCENT" ] && [ "$MEM_PERCENT" -lt "$MEM_WARN_PERCENT" ]; then
  ok "Memory usage is ${MEM_PERCENT}%"
else
  warn "Memory usage is ${MEM_PERCENT}%"
fi

section "Summary"
if [ "$FAILURES" -eq 0 ]; then
  ok "Monitoring check passed with $WARNINGS warning(s)"
else
  fail "Monitoring check failed with $FAILURES failure(s) and $WARNINGS warning(s)"
fi

mkdir -p "$(dirname "$STATUS_FILE")"
printf '%s' "$REPORT" > "$STATUS_FILE"
chmod 600 "$STATUS_FILE" || true

if [ "$FAILURES" -eq 0 ]; then
  exit 0
fi

exit 1
