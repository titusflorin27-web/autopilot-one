# BUILD #009 — Public Web Intake

Status: implemented on branch `codex/build-009-public-web-intake`.

## Scope

BUILD #009 turns Reception AI into a public website intake channel.

Customers can now message Reception AI from a public website context without needing an Autopilot One account.

## Public endpoint

```http
POST /api/public/reception-ai/message
```

Request body:

```json
{
  "organizationSlug": "your-company-slug",
  "message": "Customer question",
  "customerName": "Optional name",
  "customerEmail": "Optional email",
  "conversationId": "Optional follow-up conversation id",
  "websiteUrl": "https://customer-site.example"
}
```

## Behavior

The public endpoint:

1. Looks up the organization by slug.
2. Confirms the organization is active.
3. Accepts anonymous customer details.
4. Creates or continues a Reception AI conversation.
5. Runs the same Reception AI workflow as the internal API.
6. Returns a safe public response.

## Public response shape

The public response includes:

- `conversationId`
- `reply`
- `confidence`
- `shouldEscalate`
- `escalationReason`
- `aiProvider`
- `aiModel`
- `usedFallback`
- citation titles and scores

The response intentionally excludes internal task IDs and lead IDs.

## Validation and safety

The public DTO limits:

- organization slug length
- message length
- customer name length
- customer email length

If a public follow-up conversation id is invalid, closed or belongs to another organization, the system starts a new conversation instead of exposing internal state.

## UI

The `/widget-demo` page provides a website widget shell that calls the public endpoint.

It supports:

- organization slug input
- optional customer name
- optional customer email
- public message submission
- follow-up messages through `conversationId`
- visible provider/fallback metadata

## Validation

Expected CI commands:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next build

BUILD #010 should harden public channels:

- rate limiting
- origin allowlist
- widget token
- bot/spam controls
- public conversation lifecycle rules
- embeddable script snippet
