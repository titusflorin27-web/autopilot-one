#!/usr/bin/env sh
set -eu

API_URL="${API_URL:-http://localhost:4000/api/health}"
APP_URL="${APP_URL:-http://localhost:3000}"

printf "Checking API: %s\n" "$API_URL"
api_response="$(curl -fsS "$API_URL")"
printf "%s\n" "$api_response" | grep -q "ok" || {
  echo "API health check failed" >&2
  exit 1
}

printf "Checking Web: %s\n" "$APP_URL"
curl -fsSI "$APP_URL" >/dev/null

echo "VPS healthcheck passed."
