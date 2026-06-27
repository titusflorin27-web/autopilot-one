#!/usr/bin/env sh
set -eu

fail() {
  echo "ERROR: $1" >&2
  exit 1
}

command -v git >/dev/null 2>&1 || fail "git is required"
command -v docker >/dev/null 2>&1 || fail "docker is required"
docker compose version >/dev/null 2>&1 || fail "docker compose is required"

[ -f infrastructure/docker-compose.vps.example.yml ] || fail "missing VPS compose file"
[ -f infrastructure/caddy/Caddyfile.example ] || fail "missing Caddyfile"
[ -f apps/api/.env ] || fail "missing apps/api/.env"
[ -f apps/web/.env.local ] || fail "missing apps/web/.env.local"

grep -q "JWT_ACCESS_SECRET" apps/api/.env || fail "API env missing JWT_ACCESS_SECRET"
grep -q "DATABASE_URL" apps/api/.env || fail "API env missing DATABASE_URL"
grep -q "API_CORS_ORIGINS" apps/api/.env || fail "API env missing API_CORS_ORIGINS"
grep -q "NEXT_PUBLIC_API_URL" apps/web/.env.local || fail "Web env missing NEXT_PUBLIC_API_URL"
grep -q "NEXT_PUBLIC_APP_URL" apps/web/.env.local || fail "Web env missing NEXT_PUBLIC_APP_URL"

echo "VPS preflight passed."
