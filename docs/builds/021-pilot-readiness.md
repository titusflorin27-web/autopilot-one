# BUILD #021 — Pilot Readiness

Status: implemented on branch `codex/build-021-pilot-readiness`.

## Scope

BUILD #021 prepares the MVP for a controlled private pilot.

This build is documentation-only. It does not change runtime code or database schema.

## Added documents

- `docs/deployment-plan.md`
- `docs/pilot-readiness.md`

## Deployment plan

The deployment plan defines:

- web app runtime
- API runtime
- PostgreSQL requirement
- Redis requirement
- required environment values
- rollout order
- go criteria
- no-go criteria

## Pilot readiness

The pilot readiness checklist defines:

- ideal pilot business profile
- organization setup
- Business DNA setup
- Knowledge Base setup
- widget setup
- public test flow
- operator routine
- success metrics
- exit criteria

## Validation

CI should still run:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next decision

After BUILD #021, choose one of these:

1. Deploy to a selected platform.
2. Add platform-specific deployment templates.
3. Run first private pilot manually.
4. Add automated smoke tests.
