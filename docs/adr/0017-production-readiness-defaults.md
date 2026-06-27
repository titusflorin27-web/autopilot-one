# ADR 0017 — Production Readiness Defaults

## Status

Accepted for BUILD #018.

## Context

Autopilot One now has the main MVP capabilities: identity, Business DNA, Knowledge Base, Reception AI, widget, inbox, notifications and plans. The next step is preparing the runtime for realistic deployment.

## Decision

Add deployment-oriented defaults without adding new infrastructure dependencies.

The API bootstrap now supports:

- CORS origins from env
- basic response headers
- request logging
- clear startup logging

The health endpoint exposes a richer runtime response.

Documentation now includes a production readiness checklist.

## Consequences

Positive:

- Runtime configuration is clearer.
- Public web/API origin handling is explicit.
- Operators get better health visibility.
- The project has a release checklist.

Tradeoffs:

- Logging is still process-local.
- Rate limiting is not distributed yet.
- No external monitoring integration is configured yet.
- No deployment platform files are added yet.

## Follow-up

Future builds should add:

- deployment platform templates
- distributed rate limits
- structured log transport
- automated smoke tests
- guided demo flow
