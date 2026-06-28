#!/usr/bin/env sh
set -eu

COMPOSE_FILE="${COMPOSE_FILE:-infrastructure/docker-compose.vps.example.yml}"
BACKUP_DIR="${BACKUP_DIR:-/root/autopilot-backups/postgres}"
RETENTION_DAYS="${RETENTION_DAYS:-14}"
TIMESTAMP="$(date -u +%Y%m%dT%H%M%SZ)"
BACKUP_FILE="$BACKUP_DIR/autopilot_postgres_$TIMESTAMP.dump"
LATEST_LINK="$BACKUP_DIR/latest.dump"

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

command -v docker >/dev/null 2>&1 || fail "docker is required"
docker compose version >/dev/null 2>&1 || fail "docker compose is required"
[ -f "$COMPOSE_FILE" ] || fail "missing compose file: $COMPOSE_FILE"

mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"

echo "Creating PostgreSQL backup: $BACKUP_FILE"

docker compose -f "$COMPOSE_FILE" exec -T postgres sh -lc \
  'pg_dump -U "$POSTGRES_USER" -d "$POSTGRES_DB" --format=custom --no-owner --no-privileges' \
  > "$BACKUP_FILE"

[ -s "$BACKUP_FILE" ] || fail "backup file is empty"
chmod 600 "$BACKUP_FILE"
ln -sfn "$BACKUP_FILE" "$LATEST_LINK"

find "$BACKUP_DIR" -type f -name 'autopilot_postgres_*.dump' -mtime +"$RETENTION_DAYS" -delete

BACKUP_SIZE="$(du -h "$BACKUP_FILE" | awk '{print $1}')"
echo "PostgreSQL backup completed: $BACKUP_FILE ($BACKUP_SIZE)"
echo "Latest backup link: $LATEST_LINK"
