# BUILD #022 — Deploy Files

Status: implemented on branch `codex/build-022-deploy-files`.

## Scope

BUILD #022 adds deployment helper files for staging and pilot validation.

This build does not change product runtime behavior or database schema.

## Added files

- `.dockerignore`
- `apps/api/Dockerfile`
- `apps/web/Dockerfile`
- `infrastructure/docker-compose.production.example.yml`
- `docs/deployment-templates.md`

## What this enables

The repository can now build separate container images for:

- API app
- Web app

It also includes a compose example with:

- PostgreSQL
- Redis
- API
- Web

## Validation

CI should still run:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next decision

Choose a deployment target and add a provider-specific guide.
