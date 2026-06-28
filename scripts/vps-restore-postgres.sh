#!/usr/bin/env sh
set -eu

COMPOSE_FILE="${COMPOSE_FILE:-infrastructure/docker-compose.vps.example.yml}"
RESTORE_FILE="${1:-${RESTORE_FILE:-}}"

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

command -v docker >/dev/null 2>&1 || fail "docker is required"
docker compose version >/dev/null 2>&1 || fail "docker compose is required"
[ -f "$COMPOSE_FILE" ] || fail "missing compose file: $COMPOSE_FILE"
[ -n "$RESTORE_FILE" ] || fail "usage: CONFIRM_RESTORE=YES sh scripts/vps-restore-postgres.sh /path/to/backup.dump"
[ -f "$RESTORE_FILE" ] || fail "restore file not found: $RESTORE_FILE"
[ -s "$RESTORE_FILE" ] || fail "restore file is empty: $RESTORE_FILE"
[ "${CONFIRM_RESTORE:-}" = "YES" ] || fail "set CONFIRM_RESTORE=YES to restore; this can overwrite production data"

echo "Restoring PostgreSQL backup: $RESTORE_FILE"
echo "Recommended before restore: docker compose -f $COMPOSE_FILE stop api web"

cat "$RESTORE_FILE" | docker compose -f "$COMPOSE_FILE" exec -T postgres sh -lc \
  'pg_restore -U "$POSTGRES_USER" -d "$POSTGRES_DB" --clean --if-exists --no-owner --no-privileges'

echo "PostgreSQL restore completed. Restart api/web and run healthchecks."
