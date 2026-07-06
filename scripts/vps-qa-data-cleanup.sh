#!/usr/bin/env sh
set -eu

COMPOSE_FILE="${COMPOSE_FILE:-infrastructure/docker-compose.vps.example.yml}"
POSTGRES_SERVICE="${POSTGRES_SERVICE:-postgres}"
POSTGRES_USER="${POSTGRES_USER:-autopilot}"
POSTGRES_DB="${POSTGRES_DB:-autopilot}"
DRY_RUN="${DRY_RUN:-1}"
CONFIRM_DELETE_QA_DATA="${CONFIRM_DELETE_QA_DATA:-0}"

RUN_ID="${RUN_ID:-}"
PILOT_EMAIL="${PILOT_EMAIL:-}"
PILOT_ORG_SLUG="${PILOT_ORG_SLUG:-}"
DEMO_EMAIL="${DEMO_EMAIL:-}"
DEMO_SOURCE="${DEMO_SOURCE:-build-078a-functional-pilot-qa}"

fail() {
  echo "FAIL: $*" >&2
  exit 1
}

require_command() {
  command -v "$1" >/dev/null 2>&1 || fail "missing required command: $1"
}

psql_exec() {
  docker compose -f "$COMPOSE_FILE" exec -T "$POSTGRES_SERVICE" psql -v ON_ERROR_STOP=1 -U "$POSTGRES_USER" -d "$POSTGRES_DB" "$@"
}

if [ -n "$RUN_ID" ]; then
  PILOT_EMAIL="${PILOT_EMAIL:-pilot-qa-$RUN_ID@example.com}"
  PILOT_ORG_SLUG="${PILOT_ORG_SLUG:-autopilot-qa-$RUN_ID}"
  DEMO_EMAIL="${DEMO_EMAIL:-demo-$RUN_ID@example.com}"
fi

[ -n "$PILOT_EMAIL" ] || [ -n "$PILOT_ORG_SLUG" ] || fail "set RUN_ID, PILOT_EMAIL, or PILOT_ORG_SLUG"

require_command docker

WHERE_USER=""
WHERE_ORG=""
WHERE_DEMO=""

if [ -n "$PILOT_EMAIL" ]; then
  WHERE_USER="email = :'pilot_email'"
fi

if [ -n "$PILOT_ORG_SLUG" ]; then
  WHERE_ORG="slug = :'pilot_org_slug'"
fi

if [ -n "$DEMO_EMAIL" ]; then
  WHERE_DEMO="email = :'demo_email' OR source = :'demo_source'"
else
  WHERE_DEMO="source = :'demo_source'"
fi

echo "=== Autopilot One QA Data Cleanup ==="
echo "Compose file: $COMPOSE_FILE"
echo "Dry run: $DRY_RUN"
echo "Pilot email: ${PILOT_EMAIL:-not set}"
echo "Pilot organization slug: ${PILOT_ORG_SLUG:-not set}"
echo "Demo email: ${DEMO_EMAIL:-not set}"
echo "Demo source: $DEMO_SOURCE"

echo
 echo "=== MATCHING RECORDS ==="
psql_exec \
  -v pilot_email="$PILOT_EMAIL" \
  -v pilot_org_slug="$PILOT_ORG_SLUG" \
  -v demo_email="$DEMO_EMAIL" \
  -v demo_source="$DEMO_SOURCE" <<SQL
WITH target_org AS (
  SELECT id, slug, name, email_marker.email
  FROM "Organization"
  LEFT JOIN LATERAL (
    SELECT u.email
    FROM "Membership" m
    JOIN "User" u ON u.id = m."userId"
    WHERE m."organizationId" = "Organization".id
    ORDER BY m."createdAt" ASC
    LIMIT 1
  ) email_marker ON true
  WHERE (${WHERE_ORG:-false})
), target_user AS (
  SELECT id, email FROM "User" WHERE (${WHERE_USER:-false})
), target_demo AS (
  SELECT id, email, source FROM "DemoRequest" WHERE ($WHERE_DEMO)
)
SELECT 'organizations' AS bucket, count(*)::text AS count FROM target_org
UNION ALL
SELECT 'users' AS bucket, count(*)::text AS count FROM target_user
UNION ALL
SELECT 'demo_requests' AS bucket, count(*)::text AS count FROM target_demo;

SELECT 'target_organization' AS kind, id, slug, name FROM "Organization" WHERE (${WHERE_ORG:-false});
SELECT 'target_user' AS kind, id, email FROM "User" WHERE (${WHERE_USER:-false});
SELECT 'target_demo_request' AS kind, id, email, source FROM "DemoRequest" WHERE ($WHERE_DEMO) ORDER BY "createdAt" DESC LIMIT 20;
SQL

if [ "$DRY_RUN" = "1" ]; then
  echo
  echo "DRY RUN ONLY. Nothing was deleted."
  echo "To delete, rerun with DRY_RUN=0 CONFIRM_DELETE_QA_DATA=1 and the same RUN_ID/PILOT_EMAIL/PILOT_ORG_SLUG."
  exit 0
fi

[ "$CONFIRM_DELETE_QA_DATA" = "1" ] || fail "refusing to delete without CONFIRM_DELETE_QA_DATA=1"

echo
 echo "=== DELETING QA DATA ==="
psql_exec \
  -v pilot_email="$PILOT_EMAIL" \
  -v pilot_org_slug="$PILOT_ORG_SLUG" \
  -v demo_email="$DEMO_EMAIL" \
  -v demo_source="$DEMO_SOURCE" <<SQL
BEGIN;

WITH target_org AS (
  SELECT id FROM "Organization" WHERE (${WHERE_ORG:-false})
), target_user AS (
  SELECT id FROM "User" WHERE (${WHERE_USER:-false})
), target_conversation AS (
  SELECT id FROM "ReceptionConversation" WHERE "organizationId" IN (SELECT id FROM target_org)
), deleted_messages AS (
  DELETE FROM "ReceptionMessage" WHERE "conversationId" IN (SELECT id FROM target_conversation) RETURNING id
), deleted_widget_events AS (
  DELETE FROM "WidgetEvent" WHERE "organizationId" IN (SELECT id FROM target_org) RETURNING id
), deleted_events AS (
  DELETE FROM "Event" WHERE "organizationId" IN (SELECT id FROM target_org) RETURNING id
), deleted_tasks AS (
  DELETE FROM "Task" WHERE "organizationId" IN (SELECT id FROM target_org) RETURNING id
), deleted_chunks AS (
  DELETE FROM "KnowledgeChunk" WHERE "organizationId" IN (SELECT id FROM target_org) RETURNING id
), deleted_sources AS (
  DELETE FROM "KnowledgeSource" WHERE "organizationId" IN (SELECT id FROM target_org) RETURNING id
), deleted_conversations AS (
  DELETE FROM "ReceptionConversation" WHERE id IN (SELECT id FROM target_conversation) RETURNING id
), deleted_leads AS (
  DELETE FROM "Lead" WHERE "organizationId" IN (SELECT id FROM target_org) RETURNING id
), deleted_memberships AS (
  DELETE FROM "Membership" WHERE "organizationId" IN (SELECT id FROM target_org) OR "userId" IN (SELECT id FROM target_user) RETURNING id
), deleted_refresh_tokens AS (
  DELETE FROM "RefreshToken" WHERE "userId" IN (SELECT id FROM target_user) RETURNING id
), deleted_org AS (
  DELETE FROM "Organization" WHERE id IN (SELECT id FROM target_org) RETURNING id
), deleted_user AS (
  DELETE FROM "User" WHERE id IN (SELECT id FROM target_user) RETURNING id
), deleted_demo AS (
  DELETE FROM "DemoRequest" WHERE ($WHERE_DEMO) RETURNING id
)
SELECT 'reception_messages' AS bucket, count(*) FROM deleted_messages
UNION ALL SELECT 'widget_events', count(*) FROM deleted_widget_events
UNION ALL SELECT 'events', count(*) FROM deleted_events
UNION ALL SELECT 'tasks', count(*) FROM deleted_tasks
UNION ALL SELECT 'knowledge_chunks', count(*) FROM deleted_chunks
UNION ALL SELECT 'knowledge_sources', count(*) FROM deleted_sources
UNION ALL SELECT 'reception_conversations', count(*) FROM deleted_conversations
UNION ALL SELECT 'leads', count(*) FROM deleted_leads
UNION ALL SELECT 'memberships', count(*) FROM deleted_memberships
UNION ALL SELECT 'refresh_tokens', count(*) FROM deleted_refresh_tokens
UNION ALL SELECT 'organizations', count(*) FROM deleted_org
UNION ALL SELECT 'users', count(*) FROM deleted_user
UNION ALL SELECT 'demo_requests', count(*) FROM deleted_demo;

COMMIT;
SQL

echo
 echo "=== QA DATA CLEANUP PASSED ==="
