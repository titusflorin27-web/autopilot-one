#!/usr/bin/env sh
set -eu

BACKUP_DIR="${BACKUP_DIR:-/root/autopilot-backups/postgres}"
OFFSITE_REMOTE="${OFFSITE_REMOTE:-}"
LOG_FILE="${LOG_FILE:-/var/log/autopilot-offsite-backup.log}"
LATEST_MARKER="${LATEST_MARKER:-/tmp/autopilot-latest-backup.txt}"
MAX_BACKUP_AGE_HOURS="${MAX_BACKUP_AGE_HOURS:-36}"
DRY_RUN="${DRY_RUN:-NO}"

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

info() {
  echo "$(date -u +%Y-%m-%dT%H:%M:%SZ) $1"
}

resolve_path() {
  target="$1"
  if command -v readlink >/dev/null 2>&1; then
    readlink -f "$target" 2>/dev/null || printf '%s\n' "$target"
  else
    printf '%s\n' "$target"
  fi
}

[ "$(id -u)" -eq 0 ] || fail "run as root"
command -v rclone >/dev/null 2>&1 || fail "rclone is not installed"
[ -n "$OFFSITE_REMOTE" ] || fail "OFFSITE_REMOTE is required, for example: autopilot-spaces:autopilot-one/postgres"
[ -d "$BACKUP_DIR" ] || fail "backup dir not found: $BACKUP_DIR"

LATEST_BACKUP=""
if [ -L "$BACKUP_DIR/latest.dump" ] || [ -f "$BACKUP_DIR/latest.dump" ]; then
  LATEST_BACKUP="$(resolve_path "$BACKUP_DIR/latest.dump")"
else
  LATEST_BACKUP="$(find "$BACKUP_DIR" -type f -name 'autopilot_postgres_*.dump' -printf '%T@ %p\n' 2>/dev/null | sort -nr | awk 'NR == 1 { print $2 }')"
fi

[ -n "$LATEST_BACKUP" ] || fail "no backup file found in $BACKUP_DIR"
[ -s "$LATEST_BACKUP" ] || fail "latest backup is empty or unreadable: $LATEST_BACKUP"

NOW_SECONDS="$(date +%s)"
BACKUP_SECONDS="$(stat -c %Y "$LATEST_BACKUP")"
AGE_HOURS="$(( (NOW_SECONDS - BACKUP_SECONDS) / 3600 ))"
[ "$AGE_HOURS" -le "$MAX_BACKUP_AGE_HOURS" ] || fail "latest backup is too old: ${AGE_HOURS}h, max ${MAX_BACKUP_AGE_HOURS}h"

mkdir -p "$(dirname "$LOG_FILE")"
touch "$LOG_FILE"
chmod 600 "$LOG_FILE" || true

BACKUP_BASENAME="$(basename "$LATEST_BACKUP")"
BACKUP_SIZE="$(du -h "$LATEST_BACKUP" | awk '{print $1}')"
printf '%s\n' "$BACKUP_BASENAME" > "$LATEST_MARKER"
chmod 600 "$LATEST_MARKER" || true

info "Starting off-server backup sync" | tee -a "$LOG_FILE"
info "Backup dir: $BACKUP_DIR" | tee -a "$LOG_FILE"
info "Latest backup: $BACKUP_BASENAME, age ${AGE_HOURS}h, size $BACKUP_SIZE" | tee -a "$LOG_FILE"
info "Offsite remote: $OFFSITE_REMOTE" | tee -a "$LOG_FILE"

if [ "$DRY_RUN" = "YES" ]; then
  RCLONE_DRY_RUN="--dry-run"
  info "DRY_RUN enabled" | tee -a "$LOG_FILE"
else
  RCLONE_DRY_RUN=""
fi

rclone mkdir "$OFFSITE_REMOTE" >> "$LOG_FILE" 2>&1 || true

# Copy only real dump files. Do not depend on the local latest.dump symlink.
rclone copy "$BACKUP_DIR" "$OFFSITE_REMOTE" \
  --include 'autopilot_postgres_*.dump' \
  --exclude '*' \
  --checksum \
  --transfers 2 \
  --checkers 4 \
  $RCLONE_DRY_RUN >> "$LOG_FILE" 2>&1

# Copy a tiny marker file with the latest backup filename for quick restore lookup.
rclone copyto "$LATEST_MARKER" "$OFFSITE_REMOTE/latest.txt" $RCLONE_DRY_RUN >> "$LOG_FILE" 2>&1

if [ "$DRY_RUN" != "YES" ]; then
  rclone lsf "$OFFSITE_REMOTE" --files-only >> "$LOG_FILE" 2>&1 || true
fi

info "Off-server backup sync completed" | tee -a "$LOG_FILE"
