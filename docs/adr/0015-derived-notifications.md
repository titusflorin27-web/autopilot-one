# ADR 0015 — Derived Notification Center

## Status

Accepted for BUILD #016.

## Context

Autopilot One now has Reception AI, widget analytics and a unified inbox. Operators need a simple notification center to see urgent work without manually scanning every page.

The main urgent signals already exist in the database:

- conversations waiting for human review
- high-score leads
- high-priority tasks

## Decision

Implement the first notification center as a derived view over existing data.

No new notification table is added in this build.

The notification center returns:

- active handoff alerts
- high-score lead alerts
- high-priority task alerts
- email-ready subject and preview payloads

## Consequences

Positive:

- Fast and stable implementation.
- No migration risk.
- No duplicate source of truth.
- Operators get immediate visibility.

Tradeoffs:

- Read/unread state is not persisted yet.
- Notification delivery is not asynchronous yet.
- Email sending is not implemented yet.
- Per-user notification preferences are not modeled yet.

## Follow-up

Future builds should add:

- persistent notifications
- read/unread state
- email delivery
- Slack or webhook delivery
- per-user preferences
