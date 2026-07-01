# BUILD #052 — SEO launch polish

## Goal

Prepare the public Autopilot One web surface for indexing, canonical URLs and social sharing previews.

## Scope

This build updates only the Next.js web metadata layer and documentation.

It does not change:

- API runtime behavior
- Database schema
- Authentication behavior
- Widget token behavior
- Backup or monitoring scripts
- VPS secrets or environment files
- Legal copy content beyond route metadata

## Changes

- Adds a shared SEO metadata helper.
- Adds route-level canonical metadata for the main public pages.
- Adds Open Graph and Twitter metadata.
- Adds `robots.txt` through the Next.js metadata route.
- Adds `sitemap.xml` through the Next.js metadata route.
- Adds app manifest metadata.
- Adds SVG app icons.
- Adds a dynamic Open Graph image route.

## Public sitemap routes

```text
/
/pricing
/demo
/privacy
/terms
/refund-policy
/consumer-rights
/widget-demo
```

## Robots policy

The robots route allows the public marketing, pricing, demo and trust/legal pages.

The robots route disallows protected or operational app areas, including:

```text
/dashboard
/demo-requests
/onboarding
/knowledge-base
/reception-ai
/widget-settings
/widget-analytics
/inbox
/notifications
/billing
/launch
/api
```

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
curl -I https://app.autopilot-one.com/robots.txt
curl -I https://app.autopilot-one.com/sitemap.xml
curl -I https://app.autopilot-one.com/opengraph-image
curl -I https://app.autopilot-one.com/icon.svg
curl -I https://app.autopilot-one.com
```

Expected:

- public web returns `HTTP/2 200`
- `/robots.txt` returns 200
- `/sitemap.xml` returns 200
- `/opengraph-image` returns 200
- `/icon.svg` returns 200
- API health remains 200

## Remaining work

This build does not complete legal launch polish. The legal/GDPR/ANPC/refund review remains intentionally deferred until company details and CAEN updates are finalized.

Still pending:

- BUILD #051 — Legal/ANPC/refund/GDPR final polish
- BUILD #053 — Final Launch QA
- External uptime/backup alerting
- Full restore test in a separate environment
