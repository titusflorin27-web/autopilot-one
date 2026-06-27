# ADR 0013 — Widget Analytics and Install Health

## Status

Accepted for BUILD #014.

## Context

The public Reception AI widget is now configurable and enforced at runtime. The next operational need is visibility.

Operators need to know:

- whether the widget config is being requested
- whether the widget is loading in browsers
- whether visitors open it
- whether visitors send messages
- which domains are producing traffic
- whether the widget produces conversations, leads and tasks

## Decision

Add a `WidgetEvent` model and collect lightweight browser and server-side events.

Browser widget events:

- `LOADED`
- `OPENED`
- `ERROR`

Server-side events:

- `CONFIG_LOADED`
- `MESSAGE_SENT`
- `MESSAGE_RECEIVED`

Expose a protected analytics endpoint for organization members and add a `/widget-analytics` dashboard page.

## Consequences

Positive:

- Operators can verify widget installation.
- Product can report public funnel activity.
- Domain/source reporting becomes possible.
- The next unified inbox build can use this visibility layer.

Tradeoffs:

- Event collection is simple and not yet aggregated into rollup tables.
- No long-term retention policy yet.
- No charting library yet.
- No per-domain install verification crawler yet.

## Follow-up

Future builds should add:

- event retention policy
- aggregate daily rollups
- inbox integration
- install verification checks
- conversion reporting by domain
