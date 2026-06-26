# BUILD #003 — Identity

Status: implemented on branch `codex/build-003-identity`.

## Scope

BUILD #003 introduces the identity layer required by the Autopilot One MVP.

Implemented capabilities:

- user registration
- user login
- bcrypt password hashing
- JWT access tokens
- refresh-token persistence, rotation and revocation
- users
- organizations
- organization membership
- RBAC roles
- authentication middleware through NestJS guards
- protected API routes
- connected register/login screens
- dashboard session validation

## API endpoints

### Public

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/refresh`
- `POST /api/auth/logout`
- `GET /api/health`

### Protected

- `GET /api/users/me`
- `POST /api/organizations`
- `GET /api/organizations`
- `GET /api/organizations/:id`
- `PUT /api/business-dna`
- `POST /api/events`
- `GET /api/events/organization/:organizationId`

## Roles

Organization roles are stored in `Membership.role`:

- `OWNER`
- `ADMIN`
- `MEMBER`

Rules:

- Register creates the first organization and assigns the registering user as `OWNER`.
- Organization data is visible only to members of that organization.
- Business DNA updates require `OWNER` or `ADMIN`.
- Events can be accessed by `OWNER`, `ADMIN` and `MEMBER`.

## Data model changes

BUILD #002 linked users directly to organizations through fields on `User`.
BUILD #003 replaces that with a proper membership model:

- `User`
- `Organization`
- `Membership`
- `RefreshToken`
- `Event`

This enables one user to belong to multiple organizations and gives each organization its own RBAC context.

## Security notes

- Passwords are hashed with bcrypt.
- Refresh tokens are never stored in plain text; only SHA-256 hashes are persisted.
- Refresh-token usage rotates the token and revokes the previous record.
- Access tokens are signed JWTs.
- Production deployments must set `JWT_ACCESS_SECRET`.

## Environment variables

```env
JWT_ACCESS_SECRET="change-me-local-access-secret"
JWT_ACCESS_TOKEN_TTL="15m"
REFRESH_TOKEN_TTL_DAYS=30
```

## Local validation

```bash
pnpm install
pnpm db:generate
pnpm db:migrate
pnpm --filter @autopilot/api typecheck
pnpm --filter @autopilot/web typecheck
pnpm --filter @autopilot/api build
pnpm --filter @autopilot/web build
```

## Next build

BUILD #004 starts Business DNA as a real onboarding/configuration flow where a company describes products, services, rules, tone, FAQ and goals.
