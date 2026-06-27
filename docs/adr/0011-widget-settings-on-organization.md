# ADR 0011 — Widget Settings on Organization

## Status

Accepted for BUILD #012.

## Context

BUILD #011 shipped an embeddable widget script. The script can be installed on external websites, but configuration still requires manually editing the script tag.

Autopilot One needs a product-level install manager before widget installation can be handled by non-technical users.

## Decision

Store initial widget settings directly on `Organization`.

The settings are:

- enabled state
- title
- primary color
- position
- token
- allowed origins

Expose protected organization endpoints to read, update and regenerate widget settings.

Add a `/widget-settings` UI that generates the install snippet and supports copy-to-clipboard.

## Consequences

Positive:

- Keeps widget configuration close to the organization it belongs to.
- Avoids introducing a separate settings table before it is needed.
- Gives operators a product UI for widget installation.
- Keeps RBAC enforcement on existing organization membership roles.

Tradeoffs:

- Per-widget versioning is not modeled yet.
- Multiple widgets per organization are not supported yet.
- Runtime public enforcement still needs to be connected in the next build.

## Follow-up

Future builds should add:

- per-organization runtime enforcement
- public widget configuration endpoint
- hosted widget theme loading
- per-domain settings
- multiple widget profiles per organization
