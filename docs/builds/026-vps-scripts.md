# BUILD #026 — VPS Deploy Scripts

Status: implemented on branch `codex/build-026-vps-scripts`.

## Scope

BUILD #026 adds simple operational scripts for the selected VPS Docker pilot target.

This build does not change product runtime code or database schema.

## Added scripts

- `scripts/vps-preflight.sh`
- `scripts/vps-deploy.sh`
- `scripts/vps-healthcheck.sh`

## Preflight

Checks that the server has:

- git
- Docker
- Docker Compose
- VPS compose file
- Caddyfile
- API env file
- Web env file
- required env keys

Run:

```bash
sh scripts/vps-preflight.sh
```

## Deploy

Pulls latest `main`, rebuilds the Docker stack and runs database migrations.

Run:

```bash
sh scripts/vps-deploy.sh
```

## Healthcheck

Checks API health and Web response.

Local default:

```bash
sh scripts/vps-healthcheck.sh
```

With public URLs:

```bash
API_URL=https://api.example.com/api/health APP_URL=https://app.example.com sh scripts/vps-healthcheck.sh
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

After this build, the repo has enough deployment material for a first manual VPS pilot deploy.
