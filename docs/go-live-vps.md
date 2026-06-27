# VPS Go-Live Checklist

## Selected target

The selected first pilot target is a single VPS running Docker Compose.

This target is chosen because it is simple, controllable and portable.

## Selected pilot domains

Use these domains for the first production pilot:

- Web app: `https://app.autopilot-one.com`
- API app: `https://api.autopilot-one.com`
- API health: `https://api.autopilot-one.com/api/health`

## Required DNS

Create two DNS records:

- `app.autopilot-one.com` pointing to the VPS public IP
- `api.autopilot-one.com` pointing to the VPS public IP

Use A records when the VPS has a primary IPv4 address.

## Required files

Use these files:

- `infrastructure/docker-compose.vps.example.yml`
- `infrastructure/caddy/Caddyfile.example`
- `apps/api/.env.production.example`
- `apps/web/.env.production.example`
- `docs/vps-docker-runbook.md`

## Before deploy

1. Confirm PRs are merged into `main`.
2. Confirm CI is green on `main`.
3. Confirm server has Docker installed.
4. Confirm DNS points to the server.
5. Copy API production env example.
6. Copy Web production env example.
7. Replace every placeholder secret.
8. Confirm production domains in env files.
9. Confirm production domains in Caddyfile.
10. Confirm `API_CORS_ORIGINS` matches `https://app.autopilot-one.com`.
11. Confirm widget allowed origins match the pilot website.

## First deploy commands

From the repository root on the server:

```bash
git checkout main
git pull origin main
cp apps/api/.env.production.example apps/api/.env
cp apps/web/.env.production.example apps/web/.env.local
nano apps/api/.env
nano apps/web/.env.local
nano infrastructure/caddy/Caddyfile.example
docker compose -f infrastructure/docker-compose.vps.example.yml up --build -d
docker compose -f infrastructure/docker-compose.vps.example.yml exec api pnpm db:migrate
```

## Health checks

```bash
curl https://api.autopilot-one.com/api/health
```

Expected:

```json
{
  "status": "ok"
}
```

Then open:

```text
https://app.autopilot-one.com
```

Or run the VPS script with public URLs:

```bash
API_URL=https://api.autopilot-one.com/api/health APP_URL=https://app.autopilot-one.com sh scripts/vps-healthcheck.sh
```

## Product smoke flow

1. Register a user.
2. Open dashboard.
3. Complete Business DNA.
4. Add Knowledge Base source.
5. Open Widget Settings.
6. Configure widget allowed origin.
7. Send public test message from the pilot website.
8. Confirm Widget Analytics shows activity.
9. Confirm Inbox shows the conversation.
10. Confirm Notifications loads.
11. Confirm Billing loads.
12. Confirm Launch Checklist shows progress.

## Go decision

Go to pilot when:

- API health passes
- Web app loads
- login works
- widget public message works
- Inbox shows the message
- operator can reply
- notifications load
- launch checklist is usable

## No-go decision

Do not invite pilot users when:

- health check fails
- DNS is wrong
- login fails
- migrations fail
- public widget message fails
- Inbox fails to load
- environment values point to local URLs

## Rollback

Use the rollback procedure in `docs/vps-docker-runbook.md`.

Minimum rollback information to record before launch:

- current commit SHA
- current database backup path
- current env file snapshot location
