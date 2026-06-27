# Deploy Review — 2026-06-27

## Scope

Strict review of the current `main` branch before VPS pilot deployment.

## Verified on main

- BUILD #027 is merged.
- Selected domains are documented as:
  - Web: `https://app.autopilot-one.com`
  - API: `https://api.autopilot-one.com`
- Caddy example points the two production domains to the Docker services.
- Web production env example points to the production API and Web domains.
- VPS go-live checklist defines DNS A records for `app` and `api`.
- CI workflow runs install, Prisma generate, typecheck, build and smoke test.

## Findings

### Finding 1 — API production env example still has generic CORS origin

`apps/api/.env.production.example` still includes:

```env
API_CORS_ORIGINS=https://app.example.com
```

During deploy, this must be changed manually to:

```env
API_CORS_ORIGINS=https://app.autopilot-one.com
```

The deploy docs already warn about this, but it remains a manual step.

### Finding 2 — Widget install snippet used placeholder hosts

Before BUILD #028, the generated snippet used placeholder hosts:

```text
https://your-autopilot-web-host.example
https://your-autopilot-api-host.example/api
```

This is fixed by BUILD #028 so the widget snippet defaults to:

```text
https://app.autopilot-one.com/autopilot-widget.js
https://api.autopilot-one.com/api
```

## Local validation limitation

The local execution environment could not clone the public GitHub repository because DNS resolution for `github.com` failed. Validation was therefore performed through GitHub repository inspection and should be completed by GitHub Actions CI.

## Required before deploy

1. Merge BUILD #028 after CI passes.
2. During VPS env setup, manually confirm:

```env
API_CORS_ORIGINS=https://app.autopilot-one.com
NEXT_PUBLIC_API_URL=https://api.autopilot-one.com/api
NEXT_PUBLIC_APP_URL=https://app.autopilot-one.com
```

3. Set DNS:

```text
A app <VPS_PUBLIC_IPV4>
A api <VPS_PUBLIC_IPV4>
```

4. Run:

```bash
sh scripts/vps-preflight.sh
sh scripts/vps-deploy.sh
API_URL=https://api.autopilot-one.com/api/health APP_URL=https://app.autopilot-one.com sh scripts/vps-healthcheck.sh
```
