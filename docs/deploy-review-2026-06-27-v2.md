# Deploy Review — 2026-06-27

This file intentionally records a strict pre-deploy review for the VPS pilot.

## Verified

- BUILD #027 is merged into `main`.
- Production pilot domains are documented:
  - Web: `https://app.autopilot-one.com`
  - API: `https://api.autopilot-one.com`
- Caddy routes `app.autopilot-one.com` to `web:3000` and `api.autopilot-one.com` to `api:4000`.
- Web production env points to `https://api.autopilot-one.com/api` and `https://app.autopilot-one.com`.
- VPS go-live docs define A records for `app` and `api`.
- CI workflow includes install, Prisma generate, typecheck, build and smoke test.

## Issues found

### API env manual edit still required

`apps/api/.env.production.example` still has a generic CORS placeholder. During deploy, edit `apps/api/.env` and set:

```env
API_CORS_ORIGINS=https://app.autopilot-one.com
```

### Widget snippet placeholder fixed in BUILD #028

The generated Widget Settings install snippet previously used placeholder hosts. BUILD #028 updates the runtime defaults to:

```text
https://app.autopilot-one.com/autopilot-widget.js
https://api.autopilot-one.com/api
```

## Local validation limitation

The local execution environment could not clone GitHub because DNS resolution for `github.com` failed. GitHub Actions CI remains the authoritative validation gate.
