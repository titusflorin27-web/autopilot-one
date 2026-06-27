# BUILD #025 — VPS Deploy Target

Status: implemented on branch `codex/build-025-vps-target`.

## Scope

BUILD #025 selects the deployment target for the first private pilot.

The selected target is VPS Docker with a reverse proxy.

This build does not add product features or database migrations.

## Added files

- `infrastructure/caddy/Caddyfile.example`
- `infrastructure/docker-compose.vps.example.yml`
- `docs/go-live-vps.md`

## Target architecture

The pilot target runs:

- reverse proxy
- web app
- API app
- PostgreSQL
- Redis

Public traffic enters through the reverse proxy:

- `app.autopilot-one.com` → web app
- `api.autopilot-one.com` → API app

## Why this target

VPS Docker is selected for the first pilot because it is:

- simple to reason about
- portable
- easy to inspect
- compatible with existing Docker files
- not tied to a managed platform decision

## Validation

CI should run:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
pnpm smoke:test
```

## Next step

After this build, the repo is ready for a first manual pilot deploy.
