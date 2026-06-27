# BUILD #007 — AI Employee Operations

Status: implemented on branch `codex/build-007-ai-operations`.

## Scope

BUILD #007 turns Reception AI from a demo workflow into an operator-controlled teammate.

It adds operational controls for:

- conversations
- human handoff
- human replies
- tasks
- leads
- operations summary metrics

## API endpoints

### Protected

- `GET /api/reception-ai/organization/:organizationId/summary`
- `GET /api/reception-ai/organization/:organizationId/conversations`
- `GET /api/reception-ai/organization/:organizationId/tasks`
- `GET /api/reception-ai/organization/:organizationId/leads`
- `POST /api/reception-ai/message`
- `PATCH /api/reception-ai/conversations/:conversationId`
- `POST /api/reception-ai/conversations/:conversationId/human-reply`
- `PATCH /api/reception-ai/tasks/:taskId`
- `PATCH /api/reception-ai/leads/:leadId`

## Data model updates

BUILD #007 adds lifecycle fields:

### ReceptionConversation

- `escalationReason`
- `internalNote`
- `closedAt`

### Lead

- `ownerNote`
- `lastContactedAt`

### Task

- `ownerNote`
- `completedAt`

## Operations workflow

### Human handoff

A conversation can be moved into `WAITING_FOR_HUMAN`. Reception AI also sets an escalation reason when risk or low confidence is detected.

### Human reply

A human can add a reply to a conversation. The reply is saved as a `ReceptionMessage` with sender `HUMAN`.

### Conversation lifecycle

Conversations can be moved between:

- `OPEN`
- `WAITING_FOR_HUMAN`
- `CLOSED`

Closing a conversation sets `closedAt`.

### Task lifecycle

Tasks can be moved between:

- `OPEN`
- `DONE`
- `CANCELLED`

Completing a task sets `completedAt`.

### Lead lifecycle

Leads can be moved between:

- `NEW`
- `QUALIFIED`
- `DISQUALIFIED`
- `CONVERTED`

Lead updates can also record an owner note and last-contact timestamp.

## UI

The `/reception-ai` UI now includes:

- operations summary cards
- conversation controls
- human reply form
- task controls
- lead controls

## Validation

Expected CI commands:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next build

BUILD #008 should connect AI Gateway and model-backed response generation:

- model provider configuration
- prompt templates
- structured output parsing
- response safety checks
- fallback to rule-based response when provider is unavailable
