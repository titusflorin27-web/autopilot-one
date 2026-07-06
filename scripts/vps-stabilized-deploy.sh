#!/usr/bin/env sh
set -eu

TARGET_REF="${TARGET_REF:-main}"
COMPOSE_FILE="${COMPOSE_FILE:-infrastructure/docker-compose.vps.example.yml}"
BACKUP_ROOT="${BACKUP_ROOT:-/root/autopilot-backup}"
DEPLOY_BACKUP_DIR="$BACKUP_ROOT/pre-stabilized-deploy-$(date +%Y%m%d-%H%M%S)"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

backup_file_if_exists() {
  src="$1"
  dest="$2"
  if [ -f "$src" ]; then
    cp "$src" "$dest"
  fi
}

restore_file_if_exists() {
  src="$1"
  dest="$2"
  if [ -f "$src" ]; then
    cp "$src" "$dest"
  fi
}

wait_for_service_health() {
  service="$1"
  tries="${2:-40}"
  sleep_seconds="${3:-3}"

  echo "--- waiting for $service health ---"
  i=1
  while [ "$i" -le "$tries" ]; do
    container_id="$(docker compose -f "$COMPOSE_FILE" ps -q "$service" || true)"
    if [ -n "$container_id" ]; then
      status="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$container_id" 2>/dev/null || true)"
      echo "$service try=$i status=$status"
      if [ "$status" = "healthy" ] || [ "$status" = "running" ]; then
        return 0
      fi
    else
      echo "$service try=$i status=missing"
    fi
    i=$((i + 1))
    sleep "$sleep_seconds"
  done

  docker compose -f "$COMPOSE_FILE" ps || true
  docker compose -f "$COMPOSE_FILE" logs --tail=120 "$service" || true
  fail "$service did not become healthy"
}

echo "=== AUTOPILOT ONE STABILIZED DEPLOY ==="
date -u +"Timestamp UTC: %Y-%m-%dT%H:%M:%SZ"
echo "Target ref: $TARGET_REF"
echo "Compose file: $COMPOSE_FILE"

mkdir -p "$DEPLOY_BACKUP_DIR"

echo
 echo "=== BACKUP VPS CONFIG ==="
backup_file_if_exists "$COMPOSE_FILE" "$DEPLOY_BACKUP_DIR/docker-compose.vps.example.yml"
backup_file_if_exists "apps/api/.env" "$DEPLOY_BACKUP_DIR/api.env"
backup_file_if_exists "apps/web/.env.local" "$DEPLOY_BACKUP_DIR/web.env.local"

echo
 echo "=== SYNC TARGET REF ==="
git fetch --prune origin "$TARGET_REF"
git checkout main
git reset --hard "origin/$TARGET_REF"

echo
 echo "=== RESTORE VPS CONFIG ==="
restore_file_if_exists "$DEPLOY_BACKUP_DIR/docker-compose.vps.example.yml" "$COMPOSE_FILE"
restore_file_if_exists "$DEPLOY_BACKUP_DIR/api.env" "apps/api/.env"
restore_file_if_exists "$DEPLOY_BACKUP_DIR/web.env.local" "apps/web/.env.local"
chmod 600 apps/api/.env apps/web/.env.local 2>/dev/null || true

echo
 echo "=== BUILD AND START SERVICES ==="
docker compose -f "$COMPOSE_FILE" up -d --build postgres redis api web proxy

echo
 echo "=== WAIT FOR HEALTHCHECKS ==="
wait_for_service_health postgres 30 3
wait_for_service_health redis 30 3
wait_for_service_health api 40 3
wait_for_service_health web 40 3
wait_for_service_health proxy 20 3

echo
 echo "=== RUN LIVE QA ==="
sh scripts/vps-ro-en-live-qa.sh

echo
 echo "=== FINAL STATE ==="
git log --oneline -5
git status --short
docker compose -f "$COMPOSE_FILE" ps

echo
 echo "=== STABILIZED DEPLOY PASSED ==="
