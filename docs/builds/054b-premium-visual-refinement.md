# BUILD #054B — Premium Visual Refinement

## Goal

Refine the public homepage beyond the first redesign pass so Autopilot One looks more like a premium SaaS product and less like a simple presentation website.

## Scope

This build updates the homepage visual story and supporting CSS only.

It does not change:

- API runtime behavior
- Database schema
- Authentication behavior
- Widget token behavior
- Backups
- Monitoring
- VPS security configuration
- Environment files or secrets

## Changes

- Replaces the simple hero side card with a richer product showcase
- Adds a mock AI conversation preview
- Adds CRM lead cards inside the hero preview
- Adds stronger premium metrics
- Adds before/after messaging
- Adds dashboard preview cards
- Adds more polished hover/elevation behavior
- Improves trust and CTA visual hierarchy

## Validation checklist

CI should confirm:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
pnpm smoke:test
```

After deploy, verify:

```bash
curl -s -o /dev/null -w "APP_HOME=%{http_code}\n" https://app.autopilot-one.com
curl -s -o /dev/null -w "PRICING=%{http_code}\n" https://app.autopilot-one.com/pricing
curl -s -o /dev/null -w "DEMO=%{http_code}\n" https://app.autopilot-one.com/demo
curl -fsS https://api.autopilot-one.com/api/health && echo
```

Expected:

- homepage returns 200
- pricing returns 200
- demo returns 200
- API health remains status ok

## Deployment note

This build changes the Next.js web app. Deploy with a web rebuild on the VPS:

```bash
docker compose -f infrastructure/docker-compose.vps.example.yml up -d --build web
```

No database migration is required.
