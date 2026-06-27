# BUILD #027 — Production Domain Update

Status: implemented on branch `codex/build-027-production-domain-update`.

## Scope

BUILD #027 updates the VPS pilot deployment materials to use the selected production domain:

- Web app: `https://app.autopilot-one.com`
- API app: `https://api.autopilot-one.com`
- API health: `https://api.autopilot-one.com/api/health`

This build does not add product features and does not change the database schema.

## Updated files

- `README.md`
- `docs/deployment-plan.md`
- `docs/vps-docker-runbook.md`
- `docs/go-live-vps.md`
- `docs/builds/025-vps-target.md`
- `docs/builds/026-vps-scripts.md`
- `apps/web/.env.production.example`
- `infrastructure/caddy/Caddyfile.example`

## API env note

`apps/api/.env.production.example` still needs `API_CORS_ORIGINS` set to the production web origin during deploy:

```env
API_CORS_ORIGINS=https://app.autopilot-one.com
```

The production API env also needs real runtime values for database password, JWT secret, AI gateway key and widget token before deploy.

## DNS required

After the VPS public IPv4 is available, create these DNS records:

```text
A app <VPS_PUBLIC_IPV4>
A api <VPS_PUBLIC_IPV4>
```

## Healthcheck

After DNS and deploy:

```bash
API_URL=https://api.autopilot-one.com/api/health APP_URL=https://app.autopilot-one.com sh scripts/vps-healthcheck.sh
```

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

Merge this build before the first VPS deploy so the production domain docs and Caddy defaults match the selected domain.
