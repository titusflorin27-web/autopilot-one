# BUILD #054A — Premium Website Redesign

## Goal

Upgrade the public Autopilot One website so it feels more premium, attractive, credible and commercially ready for controlled pilot prospects.

## Scope

This build changes only the public web presentation layer and related documentation.

It does not change:

- API runtime behavior
- Database schema
- Authentication behavior
- Widget token behavior
- Backup scripts
- Monitoring scripts
- VPS security configuration
- Environment files or secrets

## Public surfaces updated

- Global visual system
- Navigation
- Footer
- Homepage
- Pricing page
- Demo page
- Demo request form copy

## Design direction

- Dark premium SaaS background
- Strong blue/violet accent system
- Better contrast and spacing
- Rounded glass-style cards
- More polished navigation and CTA styling
- More convincing homepage story
- Stronger pricing and demo page positioning
- Better mobile responsiveness

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
curl -s -o /dev/null -w "ROBOTS=%{http_code}\n" https://app.autopilot-one.com/robots.txt
curl -fsS https://api.autopilot-one.com/api/health && echo
```

Expected:

- homepage returns 200
- pricing returns 200
- demo returns 200
- SEO routes remain 200
- API health remains status ok

## Deployment note

Because this build changes the Next.js web app, deploy with a web rebuild on the VPS:

```bash
docker compose -f infrastructure/docker-compose.vps.example.yml up -d --build web
```

No database migration is required.
