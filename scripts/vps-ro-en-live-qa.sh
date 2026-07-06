#!/usr/bin/env sh
set -eu

APP_URL="${APP_URL:-https://app.autopilot-one.com}"
API_HEALTH_URL="${API_HEALTH_URL:-https://api.autopilot-one.com/api/health}"
COMPOSE_FILE="${COMPOSE_FILE:-infrastructure/docker-compose.vps.example.yml}"
TMP_DIR="${TMP_DIR:-/tmp/autopilot-ro-en-qa}"

mkdir -p "$TMP_DIR"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

check_route() {
  path="$1"
  expected="$2"
  out="$TMP_DIR/$(printf '%s' "$path" | sed 's#/#_#g; s#^_$#home#').html"
  code="$(curl -k -sS -L -o "$out" -w "%{http_code}" "$APP_URL$path" || true)"
  echo "$path code=$code"
  [ "$code" = "$expected" ] || fail "$path returned $code, expected $expected"
}

contains() {
  file="$1"
  needle="$2"
  grep -Fq "$needle" "$file" || fail "missing expected text: $needle in $file"
}

not_contains() {
  file="$1"
  needle="$2"
  if grep -Fq "$needle" "$file"; then
    fail "forbidden text still found: $needle in $file"
  fi
}

echo "=== Autopilot One RO/EN live QA ==="
date -u +"Timestamp UTC: %Y-%m-%dT%H:%M:%SZ"
echo "App URL: $APP_URL"
echo "API URL: $API_HEALTH_URL"

echo
 echo "=== ROUTE STATUS ==="
for path in / /pricing /demo /privacy /cookies /terms /refund-policy /consumer-rights /widget-demo /login /register; do
  check_route "$path" "200"
done

echo
 echo "=== API HEALTH ==="
api_body="$(curl -k -fsS "$API_HEALTH_URL")" || fail "API health request failed"
echo "$api_body"
printf '%s' "$api_body" | grep -Fq '"status":"ok"' || fail "API health did not return status ok"

echo
 echo "=== CURRENT MAIN BUILD TEXT CHECK ==="
contains "$TMP_DIR/home.html" "Angajați AI"
contains "$TMP_DIR/_pricing.html" "Starter"
contains "$TMP_DIR/_demo.html" "demo"

# These placeholders must not be live anymore after the updated legal pages deploy.
for file in "$TMP_DIR/_privacy.html" "$TMP_DIR/_terms.html"; do
  not_contains "$file" "[Denumirea societății]"
  not_contains "$file" "[CUI]"
  not_contains "$file" "[Adresă sediu]"
  not_contains "$file" "[Email contact]"
done

echo
 echo "=== SEO SURFACE ==="
robots_code="$(curl -k -sS -o "$TMP_DIR/robots.txt" -w "%{http_code}" "$APP_URL/robots.txt" || true)"
echo "robots.txt code=$robots_code"
[ "$robots_code" = "200" ] || fail "robots.txt not reachable"
contains "$TMP_DIR/robots.txt" "Disallow: /dashboard"
contains "$TMP_DIR/robots.txt" "Sitemap: $APP_URL/sitemap.xml"

sitemap_code="$(curl -k -sS -o "$TMP_DIR/sitemap.xml" -w "%{http_code}" "$APP_URL/sitemap.xml" || true)"
echo "sitemap.xml code=$sitemap_code"
[ "$sitemap_code" = "200" ] || fail "sitemap.xml not reachable"
contains "$TMP_DIR/sitemap.xml" "$APP_URL/pricing"
contains "$TMP_DIR/sitemap.xml" "$APP_URL/demo"
contains "$TMP_DIR/sitemap.xml" "$APP_URL/widget-demo"

echo
 echo "=== DOCKER STATUS ==="
if command -v docker >/dev/null 2>&1 && [ -f "$COMPOSE_FILE" ]; then
  docker compose -f "$COMPOSE_FILE" ps

  echo
  echo "=== FRESH LOG CHECK ==="
  for svc in proxy web api postgres redis; do
    echo "--- $svc ---"
    docker compose -f "$COMPOSE_FILE" logs --since=10m "$svc" 2>&1 \
      | grep -Ei "fatal|exception|panic|failed|timeout|refused|502|out of memory|no space|PrismaClient|TypeError|ReferenceError|Unhandled" \
      || echo "NO_FRESH_${svc}_ERRORS"
  done
else
  echo "Docker compose check skipped; not running on VPS or compose file missing."
fi

echo
 echo "=== QA PASSED ==="
