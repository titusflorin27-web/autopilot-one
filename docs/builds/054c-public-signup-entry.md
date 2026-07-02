# BUILD #054C — Public Signup Entry

## Goal

Make account creation visible and easy to access from the public website and login flow.

## Problem

The `/register` route and account creation flow already exist, but public visitors do not see a clear registration entry point. The navigation shows login, while the login form does not guide new users to create an account.

## Scope

This build exposes the existing registration flow more clearly.

Updated surfaces:

- Public navigation
- Homepage hero CTA
- Login form
- Register form copy

This build does not change:

- API auth behavior
- Database schema
- Password rules
- Token behavior
- Dashboard runtime behavior
- Backups, monitoring or VPS security

## Expected behavior

- Visitors can click `Creează cont` from the public navigation.
- Visitors on `/login` can switch to `/register`.
- Visitors on `/register` can switch back to `/login`.
- A successful registration still stores auth tokens and redirects to `/dashboard`.

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
curl -s -o /dev/null -w "HOME=%{http_code}\n" https://app.autopilot-one.com
curl -s -o /dev/null -w "REGISTER=%{http_code}\n" https://app.autopilot-one.com/register
curl -s -o /dev/null -w "LOGIN=%{http_code}\n" https://app.autopilot-one.com/login
curl -s -o /dev/null -w "DASHBOARD=%{http_code}\n" https://app.autopilot-one.com/dashboard
curl -fsS https://api.autopilot-one.com/api/health && echo
```

Expected:

- homepage returns 200
- register returns 200
- login returns 200
- dashboard route remains reachable
- API health remains `status: ok`

## Deployment note

This build changes the Next.js web app. Deploy with a web rebuild on the VPS:

```bash
docker compose -f infrastructure/docker-compose.vps.example.yml up -d --build web
```

No database migration is required.
