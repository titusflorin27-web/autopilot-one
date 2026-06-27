# BUILD #024 — Automated Smoke Tests

Status: implemented on branch `codex/build-024-smoke-tests`.

## Scope

BUILD #024 adds the first automated smoke test layer for the MVP release candidate.

This build does not add product features or database migrations.

## Added

- `tools/smoke-test.mjs`
- root script `smoke:test`
- CI step `pnpm smoke:test`

## What the smoke test checks

The smoke test validates that core MVP files and routes still exist:

- API bootstrap
- health controller
- public Reception AI controller
- Inbox controller
- Notifications controller
- Billing controller
- Launch controller
- Prisma schema core models
- launch, inbox, notifications and billing web pages
- Docker files
- production compose example
- release candidate docs
- MVP walkthrough
- VPS Docker runbook

## Why static smoke tests first

The current CI does not boot PostgreSQL, Redis, API and Web together.

A static smoke test is the lowest-risk first step because it catches accidental file deletion, route removal and CI drift without requiring full runtime orchestration.

## Next step

A future build can add runtime smoke tests using Docker Compose:

- start database and Redis
- run migrations
- start API
- call `/api/health`
- start Web
- verify public routes
