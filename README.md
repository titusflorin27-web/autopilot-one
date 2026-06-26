# Autopilot One

AI-native Business Operating System for small and medium businesses.

## Build #002

This build initializes the professional monorepo foundation.

### Included

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
pnpm dev
```

Web: http://localhost:3000  
API health: http://localhost:4000/api/health
