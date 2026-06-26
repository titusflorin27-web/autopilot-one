# Autopilot One

AI-native Business Operating System for small and medium businesses.

## Current build

### Build #003 — Identity

This build adds the first production-grade identity layer on top of the Build #002 monorepo foundation.

Included:

- Register endpoint
- Login endpoint
- JWT access tokens
- Refresh-token rotation and revocation
- bcrypt password hashing
- Users
- Organizations
- Organization memberships
- RBAC roles: OWNER, ADMIN, MEMBER
- Authentication and role guards for protected API routes
- Connected Register/Login UI
- Dashboard session check through `/api/users/me`

## Previous build

### Build #002 — Foundation

This build initialized the professional monorepo foundation.

Included:

- pnpm workspace
- Next.js web app
- NestJS API
- Prisma schema
- PostgreSQL + Redis via Docker
- Shared TypeScript package
- Business Kernel package
- AI Gateway package
- GitHub Actions CI
- ADR documentation

## Requirements

- Node.js 20+
- pnpm 9+
- Docker Desktop

## Local development

```bash
pnpm install
docker compose -f infrastructure/docker-compose.yml up -d
cp apps/api/.env.example apps/api/.env
cp apps/web/.env.example apps/web/.env.local
pnpm db:generate
pnpm db:migrate
pnpm dev
```

Web: http://localhost:3000  
API health: http://localhost:4000/api/health

## Identity API

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET /api/users/me
```

Protected requests use:

```http
Authorization: Bearer <accessToken>
```
