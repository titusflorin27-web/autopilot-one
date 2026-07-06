# Autopilot One — RO/EN live QA checklist

Date: 2026-07-06

## Goal

Validate that the production deployment serves the current `main` build and that Romanian / English switching works consistently on public and auth pages.

## Public routes

Check each route returns HTTP 200:

- `/`
- `/pricing`
- `/demo`
- `/privacy`
- `/cookies`
- `/terms`
- `/refund-policy`
- `/consumer-rights`
- `/widget-demo`
- `/login`
- `/register`

## Romanian checks

With language set to RO:

- homepage hero contains `Un angajat AI`
- homepage CTAs contain `Creează cont`, `Cere demo`, `Vezi planurile`
- pricing contains `Pachete clare` and plans `Free`, `Starter`, `Pro`, `Business`
- demo page contains `Vezi Autopilot One`
- legal pages do not contain `[Denumirea societății]`, `[CUI]`, `[Adresă sediu]`, `[Email contact]`
- login hero contains `Intră în centrul tău de comandă AI`
- register hero contains `Creează workspace-ul Autopilot One`

## English checks

With language set to EN:

- homepage hero contains `An AI employee`
- homepage CTAs contain `Create account`, `Request demo`, `View plans`
- pricing contains `Clear packages`
- demo page contains `See Autopilot One`
- privacy page contains `Privacy policy`
- login hero contains `Enter your AI command center`
- register hero contains `Create your Autopilot One workspace`

## Technical checks

- `https://api.autopilot-one.com/api/health` returns `status: ok`
- no fresh `web`, `api`, `proxy`, `postgres`, `redis` errors in Docker logs
- `robots.txt` allows public routes and disallows protected app routes
- `sitemap.xml` includes public routes only
- local VPS compose file can remain modified: `M infrastructure/docker-compose.vps.example.yml`
