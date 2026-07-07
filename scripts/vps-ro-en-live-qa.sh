#!/usr/bin/env sh
set -eu

APP_URL="${APP_URL:-https://app.autopilot-one.com}"
API_HEALTH_URL="${API_HEALTH_URL:-https://api.autopilot-one.com/api/health}"
COMPOSE_FILE="${COMPOSE_FILE:-infrastructure/docker-compose.vps.example.yml}"
TMP_DIR="${TMP_DIR:-/tmp/autopilot-ro-en-qa}"
WARMUP_TRIES="${WARMUP_TRIES:-30}"
WARMUP_SLEEP_SECONDS="${WARMUP_SLEEP_SECONDS:-3}"

mkdir -p "$TMP_DIR"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

cache_bust_url() {
  path="$1"
  separator="?"
  case "$path" in
    *\?*) separator="&" ;;
  esac
  printf '%s%s%sqa=%s' "$APP_URL" "$path" "$separator" "$(date +%s)"
}

route_file_name() {
  path="$1"
  printf '%s' "$path" | sed 's#/#_#g; s#^_$#home#; s#[?&=]#_#g'
}

fetch_route() {
  path="$1"
  out="$TMP_DIR/$(route_file_name "$path").html"
  code="$(curl -k -sS -L -H 'Cache-Control: no-cache' -o "$out" -w "%{http_code}" "$(cache_bust_url "$path")" || true)"
  echo "$path code=$code"
  [ "$code" = "200" ] || fail "$path returned $code, expected 200"
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

wait_for_app() {
  echo "=== WARMUP ==="
  i=1
  while [ "$i" -le "$WARMUP_TRIES" ]; do
    code="$(curl -k -sS -L -H 'Cache-Control: no-cache' -o "$TMP_DIR/warmup.html" -w "%{http_code}" "$(cache_bust_url "/")" || true)"
    echo "try=$i code=$code"
    if [ "$code" = "200" ]; then
      return 0
    fi
    i=$((i + 1))
    sleep "$WARMUP_SLEEP_SECONDS"
  done
  fail "app did not become healthy after warmup"
}

check_logs_after_baseline() {
  if ! command -v docker >/dev/null 2>&1 || [ ! -f "$COMPOSE_FILE" ]; then
    echo "Docker log check skipped; not running on VPS or compose file missing."
    return 0
  fi

  echo "=== DOCKER STATUS ==="
  docker compose -f "$COMPOSE_FILE" ps

  echo
  echo "=== POST-WARMUP LOG CHECK SINCE $LOG_BASELINE_UTC ==="
  for svc in proxy web api postgres redis; do
    echo "--- $svc ---"
    if docker compose -f "$COMPOSE_FILE" logs --since "$LOG_BASELINE_UTC" "$svc" 2>&1 \
      | grep -Ei "fatal|exception|panic|failed|timeout|refused|502|out of memory|no space|PrismaClient|TypeError|ReferenceError|Unhandled"; then
      fail "fresh post-warmup errors found in $svc logs"
    else
      echo "NO_POST_WARMUP_${svc}_ERRORS"
    fi
  done
}

echo "=== Autopilot One demo-first live QA ==="
date -u +"Timestamp UTC: %Y-%m-%dT%H:%M:%SZ"
echo "App URL: $APP_URL"
echo "API URL: $API_HEALTH_URL"

echo
wait_for_app
LOG_BASELINE_UTC="$(date -u +"%Y-%m-%dT%H:%M:%SZ")"
echo "Log baseline UTC: $LOG_BASELINE_UTC"

echo
echo "=== ROUTE STATUS ==="
for path in / /pricing /trust /demo /billing /privacy /cookies /terms /refund-policy /consumer-rights /widget-demo /login /register; do
  fetch_route "$path"
done

echo
echo "=== API HEALTH ==="
api_body="$(curl -k -fsS -H 'Cache-Control: no-cache' "$API_HEALTH_URL")" || fail "API health request failed"
echo "$api_body"
printf '%s' "$api_body" | grep -Eq '"status"[[:space:]]*:[[:space:]]*"ok"' || fail "API health did not return status ok"

echo
echo "=== DEMO-FIRST BUILD TEXT CHECK ==="
contains "$TMP_DIR/home.html" "Un angajat AI"
contains "$TMP_DIR/home.html" "Cere demo"
contains "$TMP_DIR/home.html" "Vezi planurile"
contains "$TMP_DIR/home.html" "Vezi cum lucrăm sigur"
not_contains "$TMP_DIR/home.html" "Creează cont"

contains "$TMP_DIR/_pricing.html" "Pachete clare"
contains "$TMP_DIR/_pricing.html" "Activare controlată"
contains "$TMP_DIR/_pricing.html" "Planurile plătite se activează prin demo înainte de plata online"
contains "$TMP_DIR/_pricing.html" "Business"

contains "$TMP_DIR/_trust.html" "Încredere și control"
contains "$TMP_DIR/_trust.html" "Ce nu promitem"
contains "$TMP_DIR/_trust.html" "Plăți și activare"
contains "$TMP_DIR/_trust.html" "activarea finală depinde de datele firmei"

contains "$TMP_DIR/_billing.html" "Facturare"
contains "$TMP_DIR/_demo.html" "Vezi Autopilot One"
contains "$TMP_DIR/_login.html" "Intră în centrul tău de comandă AI"
contains "$TMP_DIR/_register.html" "Creează workspace-ul Autopilot One"

for file in "$TMP_DIR/_privacy.html" "$TMP_DIR/_terms.html"; do
  not_contains "$file" "[Denumirea societății]"
  not_contains "$file" "[CUI]"
  not_contains "$file" "[Adresă sediu]"
  not_contains "$file" "[Email contact]"
done

echo
echo "=== SEO SURFACE ==="
robots_code="$(curl -k -sS -H 'Cache-Control: no-cache' -o "$TMP_DIR/robots.txt" -w "%{http_code}" "$APP_URL/robots.txt?qa=$(date +%s)" || true)"
echo "robots.txt code=$robots_code"
[ "$robots_code" = "200" ] || fail "robots.txt not reachable"
contains "$TMP_DIR/robots.txt" "Disallow: /dashboard"
contains "$TMP_DIR/robots.txt" "Sitemap: $APP_URL/sitemap.xml"

sitemap_code="$(curl -k -sS -H 'Cache-Control: no-cache' -o "$TMP_DIR/sitemap.xml" -w "%{http_code}" "$APP_URL/sitemap.xml?qa=$(date +%s)" || true)"
echo "sitemap.xml code=$sitemap_code"
[ "$sitemap_code" = "200" ] || fail "sitemap.xml not reachable"
contains "$TMP_DIR/sitemap.xml" "$APP_URL/pricing"
contains "$TMP_DIR/sitemap.xml" "$APP_URL/demo"
contains "$TMP_DIR/sitemap.xml" "$APP_URL/trust"
contains "$TMP_DIR/sitemap.xml" "$APP_URL/widget-demo"

echo
check_logs_after_baseline

echo
echo "=== DEMO-FIRST QA PASSED ==="
