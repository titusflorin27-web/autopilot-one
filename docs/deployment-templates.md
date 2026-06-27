# Deployment Templates

## Scope

This document explains the deployment helper files added for BUILD #022.

## Files

- `.dockerignore`
- `apps/api/Dockerfile`
- `apps/web/Dockerfile`
- `infrastructure/docker-compose.production.example.yml`

## API image

Build:

```bash
docker build -f apps/api/Dockerfile -t autopilot-api .
```

Run:

```bash
docker run --env-file apps/api/.env -p 4000:4000 autopilot-api
```

Health check:

```bash
curl http://localhost:4000/api/health
```

## Web image

Build:

```bash
docker build -f apps/web/Dockerfile -t autopilot-web .
```

Run:

```bash
docker run --env-file apps/web/.env.local -p 3000:3000 autopilot-web
```

## Production compose example

Run from repository root:

```bash
docker compose -f infrastructure/docker-compose.production.example.yml up --build
```

Then verify:

- Web: http://localhost:3000
- API health: http://localhost:4000/api/health

## Notes

The compose file is an example for staging or pilot validation, not a final managed production setup.

Before real production use:

- replace all placeholder secrets
- use managed database backups
- restrict database and Redis network access
- set exact CORS origins
- set exact public widget allowed origins
- run migrations before serving traffic
- verify the Launch Checklist after deploy

## Platform mapping

Any platform that supports Docker can use these files.

Recommended mapping:

- API service: `apps/api/Dockerfile`
- Web service: `apps/web/Dockerfile`
- Database: managed PostgreSQL
- Cache: managed Redis

## Next step

After these templates, choose one deployment target and add a provider-specific guide.
