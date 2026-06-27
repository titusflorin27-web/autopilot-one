# Autopilot One

AI-native Business Operating System for small and medium businesses.

## Current build

### Build #014 — Widget Analytics / Install Health

This build adds observability for the public Reception AI widget.

Included:

- `WidgetEvent` analytics table
- Widget event types: config loaded, loaded, opened, message sent, message received, error
- Public widget event tracking endpoint
- Protected widget analytics endpoint
- Install health indicators
- Public funnel metrics for conversations, messages, leads and tasks
- Domain/source reporting from public widget events
- `/widget-analytics` dashboard page
- Widget script telemetry for load/open/error
- Shared `WidgetAnalytics` contract

## Previous builds

### Build #013 — Widget Runtime Enforcement

This build connects organization widget settings to the public widget runtime.

Included:

- Public widget config endpoint
- Runtime widget enabled/disabled enforcement
- Per-organization widget token enforcement
- Per-organization allowed origins enforcement
- Runtime title/color/position loading in `/autopilot-widget.js`
- Public response widget metadata
- Widget settings UI display for public config endpoint
- Shared `PublicWidgetConfig` contract

### Build #012 — Widget Settings / Install Manager

This build adds organization-level management for the embeddable Reception AI widget.

Included:

- Widget settings stored on organizations
- Widget enable/disable flag
- Widget title configuration
- Widget primary color configuration
- Widget left/right position setting
- Widget token storage and regeneration
- Allowed origins list storage
- Protected widget settings API
- `/widget-settings` install manager UI
- Generated copy/paste install snippet
- Dashboard navigation to Widget Settings

### Build #011 — Embeddable Website Widget

This build ships the first real embeddable Reception AI widget for customer websites.

Included:

- Static widget script at `/autopilot-widget.js`
- Floating website chat bubble
- Script `data-*` configuration
- Organization slug wiring
- API URL wiring
- Optional widget token wiring
- Stable anonymous visitor id storage
- Public conversation continuation
- Widget demo page with real copy/paste snippet
- Documentation for installing the widget on external websites

### Build #010 — Public Channel Hardening

This build hardens the public website intake channel for Reception AI.

Included:

- Optional public widget token validation
- Optional public origin allowlist
- In-memory public widget rate limit
- Public visitor id support
- Public response rate-limit metadata
- Hardened `/widget-demo` page
- Shared public Reception AI response contract
- Documentation for public widget guardrails

### Build #009 — Public Web Intake

This build turns Reception AI into a public website intake channel.

Included:

- Public `POST /api/public/reception-ai/message` endpoint
- Anonymous customer message intake by organization slug
- Public follow-up conversation support
- Validation limits for public input
- Active-organization check before public access
- Safe public response shape without internal task/lead IDs
- Connected `/widget-demo` page
- Website widget UI shell
- Dashboard navigation to Website Widget

### Build #008 — AI Gateway

This build connects Reception AI to the AI Gateway and prepares model-backed response generation.

Included:

- Expanded `@autopilot/ai-gateway` provider abstraction
- OpenAI-compatible chat provider
- JSON response parsing through `runJson`
- Deterministic fallback when no provider or invalid output is available
- Reception AI prompt template
- Model-backed structured output contract
- AI provider/model/fallback metadata in message events
- AI Gateway environment configuration
- `/reception-ai` UI display for provider, model and fallback mode

### Build #007 — AI Employee Operations

This build turns Reception AI from a demo employee into an operational teammate.

Included:

- Operations summary for conversations, tasks and leads
- Human handoff workflow
- Human reply workflow
- Conversation lifecycle controls: open, waiting for human, closed
- Task lifecycle controls: open, done, cancelled
- Lead lifecycle controls: qualified, converted, disqualified
- Internal notes and escalation reasons
- Completed timestamps for tasks
- Closed timestamps for conversations
- Connected `/reception-ai` operations UI

### Build #006 — Reception AI

This build adds the first AI Employee: Reception AI.

Included:

- Reception conversations
- Customer and AI messages
- Lead detection and scoring
- Automatic task creation
- Human escalation when confidence is low or risk signals appear
- Business DNA context usage
- Knowledge Base retrieval usage
- Protected Reception AI API with organization-scoped RBAC
- Connected `/reception-ai` UI
- Dashboard navigation to Reception AI

### Build #005 — Knowledge Base

This build adds the first organization-level Knowledge Base layer.

Included:

- Upload TXT, PDF and DOCX sources
- Website source ingestion
- Knowledge source registry
- Automatic chunk indexing
- Search endpoint for indexed knowledge chunks
- Shared Knowledge Base TypeScript contracts
- Protected Knowledge Base API with organization-scoped RBAC
- Connected `/knowledge-base` UI
- Dashboard navigation to Knowledge Base

### Build #004 — Business DNA

This build turns company onboarding into a structured Business DNA profile that AI Employees can use as operating context.

Included:

- Shared Business DNA TypeScript contract
- Structured fields for summary, products, services, rules, tone, FAQ and objectives
- Protected `GET /api/business-dna/:organizationId` endpoint
- Protected `PUT /api/business-dna` endpoint
- OWNER/ADMIN write access and member read access
- Real onboarding UI connected to the API
- Dashboard navigation to Business DNA

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

## AI Gateway configuration

Reception AI runs without an AI provider by using deterministic fallback mode. To enable model-backed output, configure:

```env
AI_GATEWAY_PROVIDER="openai"
AI_GATEWAY_MODEL="gpt-4o-mini"
AI_GATEWAY_BASE_URL="https://api.openai.com/v1"
AI_GATEWAY_API_KEY=""
```

## Public widget hardening

Public widget hardening is optional for local/demo use. Configure these in the API environment when needed:

```env
PUBLIC_WIDGET_TOKEN=""
PUBLIC_WIDGET_ALLOWED_ORIGINS="https://customer-site.example,https://www.customer-site.example"
PUBLIC_WIDGET_RATE_LIMIT_MAX=20
PUBLIC_WIDGET_RATE_LIMIT_WINDOW_SECONDS=60
```

Organization widget settings override global token/origin defaults when configured.

## Widget settings API

```http
GET /api/organizations/:id/widget-settings
PATCH /api/organizations/:id/widget-settings
POST /api/organizations/:id/widget-settings/token
```

## Public widget config API

```http
GET /api/public/reception-ai/widget/:organizationSlug/config
```

Returns runtime-safe widget configuration:

```json
{
  "organizationSlug": "your-company-slug",
  "widgetEnabled": true,
  "title": "Reception AI",
  "primaryColor": "#8ee6c9",
  "position": "RIGHT"
}
```

## Website widget embed

Add this snippet before the closing `body` tag on a customer website:

```html
<script
  src="https://your-autopilot-web-host.example/autopilot-widget.js"
  data-organization-slug="your-company-slug"
  data-api-url="https://your-autopilot-api-host.example/api"
  data-title="Reception AI"
  data-widget-token="optional-public-widget-token"
  async
></script>
```

For local development:

```html
<script
  src="http://localhost:3000/autopilot-widget.js"
  data-organization-slug="your-company-slug"
  data-api-url="http://localhost:4000/api"
  data-title="Reception AI"
  async
></script>
```

## Identity API

```http
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh
POST /api/auth/logout
GET /api/users/me
```

## Business DNA API

```http
GET /api/business-dna/:organizationId
PUT /api/business-dna
```

## Knowledge Base API

```http
GET /api/knowledge-base/organization/:organizationId/sources
POST /api/knowledge-base/text
POST /api/knowledge-base/website
POST /api/knowledge-base/upload
POST /api/knowledge-base/search
```

## Reception AI API

```http
GET /api/reception-ai/organization/:organizationId/summary
GET /api/reception-ai/organization/:organizationId/widget-analytics
GET /api/reception-ai/organization/:organizationId/conversations
GET /api/reception-ai/organization/:organizationId/tasks
GET /api/reception-ai/organization/:organizationId/leads
POST /api/reception-ai/message
PATCH /api/reception-ai/conversations/:conversationId
POST /api/reception-ai/conversations/:conversationId/human-reply
PATCH /api/reception-ai/tasks/:taskId
PATCH /api/reception-ai/leads/:leadId
```

## Public Website API

```http
GET /api/public/reception-ai/widget/:organizationSlug/config
POST /api/public/reception-ai/widget/event
POST /api/public/reception-ai/message
```

Public message body:

```json
{
  "organizationSlug": "your-company-slug",
  "message": "Customer question",
  "customerName": "Optional name",
  "customerEmail": "Optional email",
  "conversationId": "Optional follow-up conversation id",
  "visitorId": "Stable anonymous visitor id",
  "widgetToken": "Optional public widget token",
  "websiteUrl": "https://customer-site.example"
}
```

Public event body:

```json
{
  "organizationSlug": "your-company-slug",
  "type": "OPENED",
  "visitorId": "Stable anonymous visitor id",
  "conversationId": "Optional conversation id",
  "websiteUrl": "https://customer-site.example"
}
```

Protected requests use:

```http
Authorization: Bearer <accessToken>
```
