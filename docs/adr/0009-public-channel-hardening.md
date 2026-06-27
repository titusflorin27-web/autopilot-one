# ADR 0009 — Public Channel Hardening

## Status

Accepted for BUILD #010.

## Context

BUILD #009 introduced public website intake for Reception AI. That creates a useful acquisition surface, but public endpoints need basic abuse protection before an embeddable widget is shipped.

The system needs local/demo usability while also allowing stricter production settings.

## Decision

Add lightweight public channel guardrails inside the Reception AI service:

- optional widget token
- optional origin allowlist
- in-memory rate limiting
- visitor id support

The guardrails are environment-configured instead of database-configured for this build. This keeps the change fast and avoids adding organization settings UI before the real embeddable widget exists.

## Consequences

Positive:

- Public endpoint can be hardened without breaking local demos.
- Rate limits reduce accidental or simple abuse.
- Origin allowlist supports controlled deployments.
- Widget token supports simple shared-secret gating.
- The public API contract is ready for the widget script.

Tradeoffs:

- In-memory rate limiting resets when the API process restarts.
- Rate limiting is not distributed across multiple API instances.
- Widget token is global, not per organization.
- Origin allowlist is environment-level, not organization-level.

## Follow-up

Future builds should add:

- Redis-backed distributed rate limiting
- per-organization widget settings
- per-organization widget tokens
- allowed domains per organization
- bot/spam signals
- full embeddable widget script
