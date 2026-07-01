#!/usr/bin/env sh
set -eu

COMPOSE_FILE="${COMPOSE_FILE:-infrastructure/docker-compose.vps.example.yml}"
APP_URL="${APP_URL:-https://app.autopilot-one.com}"
API_URL="${API_URL:-https://api.autopilot-one.com/api/health}"
BACKUP_DIR="${BACKUP_DIR:-/root/autopilot-backups/postgres}"
OFFSITE_REMOTE="${OFFSITE_REMOTE:-autopilot-offsite:autopilot-one-backups/autopilot-one/postgres}"
STATUS_FILE="${STATUS_FILE:-/var/log/autopilot-final-launch-qa.txt}"
MAX_BACKUP_AGE_HOURS="${MAX_BACKUP_AGE_HOURS:-36}"
MAX_MONITORING_AGE_MINUTES="${MAX_MONITORING_AGE_MINUTES:-30}"
DISK_WARN_PERCENT="${DISK_WARN_PERCENT:-85}"
MEM_WARN_PERCENT="${MEM_WARN_PERCENT:-90}"

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
  curl -fsS -o /dev/null -w '%{http_code}' --max-time 20 "$1" 2>/dev/null || echo "000"
}

check_http_ok() {
  label="$1"
  url="$2"
  status="$(http_status "$url")"
  case "$status" in
    2*|3*) ok "$label reachable: $status $url" ;;
    *) fail "$label unhealthy: $status $url" ;;
  esac
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

resolve_backup_path() {
  backup_path="$1"
  if command -v readlink >/dev/null 2>&1; then
    readlink -f "$backup_path" 2>/dev/null || printf '%s\n' "$backup_path"
  else
    printf '%s\n' "$backup_path"
  fi
}

file_age_minutes() {
  path="$1"
  now_seconds="$(date +%s)"
  file_seconds="$(stat -c %Y "$path")"
  echo "$(( (now_seconds - file_seconds) / 60 ))"
}

section "Autopilot One final launch QA"
add_line "Timestamp UTC: $(date -u +%Y-%m-%dT%H:%M:%SZ)"
add_line "Host: $(hostname)"
add_line "Compose file: $COMPOSE_FILE"
add_line "App URL: $APP_URL"
add_line "API URL: $API_URL"

section "Repository state"
if command -v git >/dev/null 2>&1 && git rev-parse --is-inside-work-tree >/dev/null 2>&1; then
  ok "Git repository detected: $(git rev-parse --show-toplevel)"
  ok "Current commit: $(git rev-parse --short HEAD)"
  if git status --short | grep -q .; then
    warn "Git working tree has local changes; this is expected on the VPS only for restored environment/compose files"
    git status --short | sed 's/^/INFO: git status: /'
  else
    ok "Git working tree is clean"
  fi
else
  warn "Not running inside a git work tree"
fi

section "HTTP public surface"
check_http_ok "App homepage" "$APP_URL"
check_http_ok "Pricing page" "$APP_URL/pricing"
check_http_ok "Demo page" "$APP_URL/demo"
check_http_ok "Privacy page" "$APP_URL/privacy"
check_http_ok "Terms page" "$APP_URL/terms"
check_http_ok "Refund policy page" "$APP_URL/refund-policy"
check_http_ok "Consumer rights page" "$APP_URL/consumer-rights"
check_http_ok "Widget demo page" "$APP_URL/widget-demo"
check_http_ok "Robots route" "$APP_URL/robots.txt"
check_http_ok "Sitemap route" "$APP_URL/sitemap.xml"
check_http_ok "Open Graph image route" "$APP_URL/opengraph-image"
check_http_ok "Icon route" "$APP_URL/icon.svg"
check_http_ok "Manifest route" "$APP_URL/manifest.webmanifest"

section "API health"
API_BODY="$(curl -fsS --max-time 20 "$API_URL" 2>/dev/null || true)"
if printf '%s' "$API_BODY" | grep -q '"status":"ok"'; then
  ok "API health returned status ok"
  add_line "INFO: API health body: $API_BODY"
else
  fail "API health did not return status ok: ${API_BODY:-empty response}"
fi

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

section "Monitoring freshness"
MONITORING_STATUS_FILE="/var/log/autopilot-monitoring-status.txt"
if [ -s "$MONITORING_STATUS_FILE" ]; then
  AGE_MINUTES="$(file_age_minutes "$MONITORING_STATUS_FILE")"
  if [ "$AGE_MINUTES" -le "$MAX_MONITORING_AGE_MINUTES" ]; then
    ok "Monitoring status file is fresh: ${AGE_MINUTES}m old"
  else
    fail "Monitoring status file is stale: ${AGE_MINUTES}m old, max ${MAX_MONITORING_AGE_MINUTES}m"
  fi
else
  fail "Monitoring status file missing or empty: $MONITORING_STATUS_FILE"
fi

section "Local PostgreSQL backup"
LATEST_BACKUP=""
if [ -L "$BACKUP_DIR/latest.dump" ] || [ -f "$BACKUP_DIR/latest.dump" ]; then
  LATEST_BACKUP="$BACKUP_DIR/latest.dump"
elif [ -d "$BACKUP_DIR" ]; then
  LATEST_BACKUP="$(find "$BACKUP_DIR" -type f -name 'autopilot_postgres_*.dump' -printf '%T@ %p\n' 2>/dev/null | sort -nr | awk 'NR == 1 { print $2 }')"
fi

if [ -n "$LATEST_BACKUP" ]; then
  RESOLVED_BACKUP="$(resolve_backup_path "$LATEST_BACKUP")"
else
  RESOLVED_BACKUP=""
fi

if [ -n "$RESOLVED_BACKUP" ] && [ -s "$RESOLVED_BACKUP" ]; then
  NOW_SECONDS="$(date +%s)"
  BACKUP_SECONDS="$(stat -c %Y "$RESOLVED_BACKUP")"
  AGE_HOURS="$(( (NOW_SECONDS - BACKUP_SECONDS) / 3600 ))"
  BACKUP_SIZE="$(du -h "$RESOLVED_BACKUP" | awk '{print $1}')"
  if [ "$AGE_HOURS" -le "$MAX_BACKUP_AGE_HOURS" ]; then
    ok "Latest local backup is recent: ${AGE_HOURS}h old, size $BACKUP_SIZE, path $RESOLVED_BACKUP"
  else
    fail "Latest local backup is too old: ${AGE_HOURS}h old, max ${MAX_BACKUP_AGE_HOURS}h"
  fi
else
  fail "No usable local PostgreSQL backup found in $BACKUP_DIR"
fi

section "Off-server backup marker"
if command -v rclone >/dev/null 2>&1; then
  LATEST_REMOTE="$(rclone cat "$OFFSITE_REMOTE/latest.txt" 2>/dev/null | tr -d '\r\n' || true)"
  if [ -n "$LATEST_REMOTE" ]; then
    ok "Remote latest marker exists: $LATEST_REMOTE"
    if rclone lsf "$OFFSITE_REMOTE" --files-only 2>/dev/null | grep -qx "$LATEST_REMOTE"; then
      ok "Remote latest dump exists: $LATEST_REMOTE"
    else
      fail "Remote latest marker points to a missing dump: $LATEST_REMOTE"
    fi
  else
    fail "Remote latest marker missing or unreadable: $OFFSITE_REMOTE/latest.txt"
  fi
else
  fail "rclone is not installed"
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
  ok "Final launch QA passed with $WARNINGS warning(s)"
else
  fail "Final launch QA failed with $FAILURES failure(s) and $WARNINGS warning(s)"
fi

mkdir -p "$(dirname "$STATUS_FILE")"
printf '%s' "$REPORT" > "$STATUS_FILE"
chmod 600 "$STATUS_FILE" || true
add_line "INFO: Report written to $STATUS_FILE"

if [ "$FAILURES" -eq 0 ]; then
  exit 0
fi

exit 1
