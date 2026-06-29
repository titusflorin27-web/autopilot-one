#!/usr/bin/env sh
set -eu

BACKUP_FILE="${BACKUP_FILE:-}"
BACKUP_DIR="${BACKUP_DIR:-/root/autopilot-backups/postgres}"
MIN_SIZE_BYTES="${MIN_SIZE_BYTES:-1024}"

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

resolve_path() {
  target="$1"
  if command -v readlink >/dev/null 2>&1; then
    readlink -f "$target" 2>/dev/null || printf '%s\n' "$target"
  else
    printf '%s\n' "$target"
  fi
}

if [ -z "$BACKUP_FILE" ]; then
  if [ -L "$BACKUP_DIR/latest.dump" ] || [ -f "$BACKUP_DIR/latest.dump" ]; then
    BACKUP_FILE="$(resolve_path "$BACKUP_DIR/latest.dump")"
  elif [ -d "$BACKUP_DIR" ]; then
    BACKUP_FILE="$(find "$BACKUP_DIR" -type f -name 'autopilot_postgres_*.dump' -printf '%T@ %p\n' 2>/dev/null | sort -nr | awk 'NR == 1 { print $2 }')"
  fi
fi

[ -n "$BACKUP_FILE" ] || fail "no backup file found"
[ -f "$BACKUP_FILE" ] || fail "backup file not found: $BACKUP_FILE"
[ -s "$BACKUP_FILE" ] || fail "backup file is empty: $BACKUP_FILE"

SIZE_BYTES="$(stat -c %s "$BACKUP_FILE")"
[ "$SIZE_BYTES" -ge "$MIN_SIZE_BYTES" ] || fail "backup file is smaller than expected: ${SIZE_BYTES} bytes"

command -v pg_restore >/dev/null 2>&1 || fail "pg_restore is required on host for local verification"

echo "Verifying PostgreSQL backup file"
echo "Backup: $BACKUP_FILE"
echo "Size: $SIZE_BYTES bytes"

pg_restore --list "$BACKUP_FILE" >/tmp/autopilot_pg_restore_list.txt
OBJECT_COUNT="$(wc -l < /tmp/autopilot_pg_restore_list.txt | awk '{print $1}')"
[ "$OBJECT_COUNT" -gt 0 ] || fail "pg_restore list is empty"

echo "pg_restore list entries: $OBJECT_COUNT"
echo "First entries:"
head -n 20 /tmp/autopilot_pg_restore_list.txt

echo "Backup verification passed."
echo "This confirms the dump is readable by pg_restore. It does not overwrite or restore any database."
