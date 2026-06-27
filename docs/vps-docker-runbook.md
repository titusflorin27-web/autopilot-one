# VPS Docker Runbook

## Goal

Run Autopilot One MVP on a single Docker-capable server for a private pilot.

This runbook is intended for a controlled pilot, not high-scale production.

## Runtime shape

Services:

- web
- api
- postgres
- redis

## Server preparation

Install Docker and Docker Compose using the official instructions for your server operating system.

Create an app directory:

```bash
mkdir -p /opt/autopilot-one
cd /opt/autopilot-one
```

Clone the repository:

```bash
git clone https://github.com/titusflorin27-web/autopilot-one.git .
```

Checkout the deployment branch or main release branch:

```bash
git checkout main
```

## Environment setup

Copy the examples:

```bash
cp apps/api/.env.production.example apps/api/.env
cp apps/web/.env.production.example apps/web/.env.local
```

Edit values:

```bash
nano apps/api/.env
nano apps/web/.env.local
```

Required replacements:

- database password
- JWT secret
- public web URL
- public API URL
- CORS origins
- widget allowed origins
- optional AI Gateway key

## Start stack

```bash
docker compose -f infrastructure/docker-compose.production.example.yml up --build -d
```

## Database migration

Run migrations after the database is up:

```bash
docker compose -f infrastructure/docker-compose.production.example.yml exec api pnpm db:migrate
```

## Health check

```bash
curl http://localhost:4000/api/health
```

Expected result:

```json
{
  "status": "ok"
}
```

## Web check

Open:

```text
http://localhost:3000
```

Verify:

- homepage loads
- register works
- login works
- dashboard loads

## Public widget check

After creating an organization and setting Business DNA:

1. Open `/widget-settings`.
2. Copy install snippet.
3. Install on a test page.
4. Send one public message.
5. Open `/widget-analytics`.
6. Open `/inbox`.

## Logs

API logs:

```bash
docker compose -f infrastructure/docker-compose.production.example.yml logs -f api
```

Web logs:

```bash
docker compose -f infrastructure/docker-compose.production.example.yml logs -f web
```

Database logs:

```bash
docker compose -f infrastructure/docker-compose.production.example.yml logs -f postgres
```

## Update deployment

```bash
git pull origin main
docker compose -f infrastructure/docker-compose.production.example.yml up --build -d
docker compose -f infrastructure/docker-compose.production.example.yml exec api pnpm db:migrate
```

Then verify:

```bash
curl http://localhost:4000/api/health
```

## Backup reminder

Before every pilot update:

- export database backup
- record current commit SHA
- record current env values

## Rollback procedure

1. Identify previous good commit.
2. Checkout it:

```bash
git checkout <previous-good-sha>
```

3. Rebuild stack:

```bash
docker compose -f infrastructure/docker-compose.production.example.yml up --build -d
```

4. Restore database backup if a migration changed data shape.
5. Verify API health.
6. Verify login.
7. Verify Inbox.

## Pilot daily checks

Each day:

- check `/api/health`
- check `/widget-analytics`
- check `/inbox`
- check `/notifications`
- review new leads
- review Knowledge Base gaps

## Stop stack

```bash
docker compose -f infrastructure/docker-compose.production.example.yml down
```

## Destroy local volumes

Only use this for disposable pilot environments:

```bash
docker compose -f infrastructure/docker-compose.production.example.yml down -v
```
