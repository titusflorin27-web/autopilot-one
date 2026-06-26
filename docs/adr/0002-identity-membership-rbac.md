# ADR 0002 — Identity, Membership and RBAC

## Status

Accepted for BUILD #003.

## Context

Autopilot One is a multi-tenant SaaS product. A single user can eventually participate in more than one organization, and every organization needs its own permission context.

The BUILD #002 schema had a direct optional `organizationId` and `role` on `User`. That was enough for the foundation, but it does not scale cleanly for a SaaS operating system with organization-specific roles.

## Decision

Use a dedicated `Membership` model between `User` and `Organization`.

The identity model is:

- `User` owns credentials and profile data.
- `Organization` owns company-level data.
- `Membership` connects users to organizations and stores the role.
- `RefreshToken` stores hashed refresh tokens for session rotation and revocation.

Roles are stored as `MembershipRole`:

- `OWNER`
- `ADMIN`
- `MEMBER`

Authentication is handled with a custom `JwtAuthGuard` and role authorization with `RolesGuard`.

## Consequences

Positive:

- One user can join multiple organizations.
- RBAC is organization-scoped instead of globally attached to the user.
- Refresh tokens can be revoked and rotated.
- Future team invitations can reuse the same membership model.

Tradeoffs:

- Every protected organization endpoint must provide an organization context.
- Role checks require a database lookup.
- Frontend session management is currently localStorage-based and should move to a hardened cookie strategy before production launch.

## Follow-up

Before public production launch, evaluate:

- HTTP-only secure cookies for refresh tokens.
- CSRF strategy if cookie-based auth is introduced.
- email verification.
- password reset.
- invited team-member onboarding.
