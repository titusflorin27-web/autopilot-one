# ADR 0016 — Billing and Usage Readiness

## Status

Accepted for BUILD #017.

## Context

Autopilot One is moving from MVP functionality toward monetizable product readiness. The product needs a stable internal model for plans, account status and usage limits.

## Decision

Add account plan state directly to `Organization` for the first billing build.

The first model includes:

- plan
- account status
- current usage period start

Usage is calculated from existing data:

- widget message events
- knowledge sources
- organization memberships

Expose a protected billing overview endpoint and a demo-safe manual plan update endpoint.

## Consequences

Positive:

- Product now has clear plan boundaries.
- Usage can be shown in the UI.
- Commercial readiness can advance incrementally.
- Existing operational data remains the source of truth.

Tradeoffs:

- External checkout is not connected yet.
- Invoices are not modeled yet.
- Usage enforcement is not hard-blocking yet.
- Plan changes are manual for MVP/demo use.

## Follow-up

Future builds should add:

- checkout integration
- invoice references
- hard usage enforcement
- plan-based feature flags
- customer account links
