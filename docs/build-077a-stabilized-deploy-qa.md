# BUILD #077A — Stabilized deploy healthcheck QA

## Scope

This build stabilizes production deployment and live QA after the RO/EN public site rollout.

## Changes

- Adds Docker healthchecks for PostgreSQL, Redis, API and Web in the VPS compose file.
- Uses service health conditions for dependent services where Docker Compose supports them.
- Hardens `scripts/vps-ro-en-live-qa.sh`:
  - waits for the app to return `200` before validation;
  - records a log baseline after warm-up;
  - checks public routes after warm-up;
  - checks current homepage, pricing, demo, login and register copy;
  - checks legal placeholders are not present;
  - checks API health, robots and sitemap;
  - fails on post-warm-up fresh errors instead of reporting old restart noise.
- Adds `scripts/vps-stabilized-deploy.sh` for repeatable VPS deployment with config backup, service health waits and final live QA.

## Deployment

Run on VPS after the branch lands on `main`:

```bash
cd /opt/autopilot-one
sh scripts/vps-stabilized-deploy.sh
```

## Expected result

- All public routes return `200`.
- API health returns `status: ok`.
- Homepage shows `Un angajat AI`.
- Pricing shows `Pachete clare` and `Business`.
- Login shows `Intră în centrul tău de comandă AI`.
- Register shows `Creează workspace-ul Autopilot One`.
- No legal placeholders appear on `/privacy` or `/terms`.
- No post-warm-up service errors are found.

## Out of scope

- No product feature changes.
- No database schema changes.
- No billing changes.
- No copy changes beyond QA text expectations.
