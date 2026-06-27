# BUILD #023 — Deployment Runbook

Status: implemented on branch `codex/build-023-runbook`.

## Scope

BUILD #023 adds the first operational runbook for running Autopilot One on a Docker-capable server.

This build is documentation and configuration only. It does not change runtime product code or database schema.

## Added files

- `apps/api/.env.production.example`
- `apps/web/.env.production.example`
- `docs/vps-docker-runbook.md`

## What this enables

Operators now have a concrete runbook for:

- preparing a server
- cloning the repo
- setting production env values
- starting the Docker stack
- running migrations
- checking API health
- checking the web app
- validating public widget flow
- viewing logs
- updating deployment
- rolling back
- daily pilot checks

## Validation

CI should still run:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next decision

After this build, the next step is to choose the actual pilot deployment target or add automated smoke tests.
