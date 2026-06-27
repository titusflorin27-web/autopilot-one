# BUILD #019 — Demo Flow / MVP Polish

Status: implemented on branch `codex/build-019-demo-flow`.

## Scope

BUILD #019 adds a guided launch checklist and demo flow for the MVP.

The goal is to make Autopilot One easy to present end-to-end without adding another large product feature.

## API

New protected endpoint:

```http
GET /api/launch/organization/:organizationId/checklist
```

The checklist is computed from existing product data:

- Business DNA presence
- Knowledge Base source count
- widget enabled state
- widget analytics events
- public website conversations
- inbox handoffs
- high-priority tasks
- account plan state

## UI

New page:

```http
/launch
```

Included:

- launch progress percentage
- ready-for-pilot indicator
- public conversation count
- guided demo path
- demo script cards
- links into the exact app pages operators need to complete setup

## Demo path

The intended MVP demo flow is:

1. Register and open dashboard.
2. Complete Business DNA.
3. Add Knowledge Base sources.
4. Configure and install website widget.
5. Send a public website message.
6. Review and resolve the conversation in Inbox.
7. Review Notifications.
8. Review Plans and Usage.

## Design choice

No new database table is added in this build. The launch checklist is derived from existing data to keep the build stable.

## Validation

Expected CI commands:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next build

BUILD #020 should be Release Candidate / Smoke Test:

- final docs cleanup
- smoke test checklist
- full MVP walkthrough
- release candidate tag or docs
- decide deployment target
