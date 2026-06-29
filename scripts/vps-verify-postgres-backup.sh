#!/usr/bin/env sh
set -eu

COMPOSE_FILE="${COMPOSE_FILE:-infrastructure/docker-compose.vps.example.yml}"
BACKUP_FILE="${BACKUP_FILE:-}"
BACKUP_DIR="${BACKUP_DIR:-/root/autopilot-backups/postgres}"
MIN_SIZE_BYTES="${MIN_SIZE_BYTES:-1024}"
POSTGRES_SERVICE="${POSTGRES_SERVICE:-postgres}"

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
[ -f "$COMPOSE_FILE" ] || fail "compose file not found: $COMPOSE_FILE"

SIZE_BYTES="$(stat -c %s "$BACKUP_FILE")"
[ "$SIZE_BYTES" -ge "$MIN_SIZE_BYTES" ] || fail "backup file is smaller than expected: ${SIZE_BYTES} bytes"

container_id="$(docker compose -f "$COMPOSE_FILE" ps -q "$POSTGRES_SERVICE")"
[ -n "$container_id" ] || fail "postgres service is not running"

echo "Verifying PostgreSQL backup file"
echo "Backup: $BACKUP_FILE"
echo "Size: $SIZE_BYTES bytes"

tmp_name="/tmp/autopilot_verify_$(basename "$BACKUP_FILE")"
docker cp "$BACKUP_FILE" "$container_id:$tmp_name"

docker compose -f "$COMPOSE_FILE" exec -T "$POSTGRES_SERVICE" \
  pg_restore --list "$tmp_name" >/tmp/autopilot_pg_restore_list.txt

OBJECT_COUNT="$(wc -l < /tmp/autopilot_pg_restore_list.txt | awk '{print $1}')"
[ "$OBJECT_COUNT" -gt 0 ] || fail "pg_restore list is empty"

echo "pg_restore list entries: $OBJECT_COUNT"
echo "First entries:"
head -n 20 /tmp/autopilot_pg_restore_list.txt

docker compose -f "$COMPOSE_FILE" exec -T "$POSTGRES_SERVICE" rm -f "$tmp_name" >/dev/null 2>&1 || true

echo "Backup verification passed."
echo "This confirms the dump is readable by pg_restore inside the Postgres container."
echo "It does not overwrite or restore any database."
