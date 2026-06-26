# BUILD #006 — Reception AI

Status: implemented on branch `codex/build-006-reception-ai`.

## Scope

BUILD #006 introduces the first AI Employee in Autopilot One: Reception AI.

Reception AI can:

- accept a customer message
- use Business DNA as company context
- retrieve relevant Knowledge Base chunks
- generate a response
- calculate confidence
- detect and score leads
- create follow-up tasks
- escalate risky or low-confidence cases to humans

## API endpoints

### Protected

- `GET /api/reception-ai/organization/:organizationId/conversations`
- `GET /api/reception-ai/organization/:organizationId/tasks`
- `POST /api/reception-ai/message`

Access rules:

- `OWNER`, `ADMIN` and `MEMBER` can use Reception AI in this MVP.

## Data model

BUILD #006 adds:

- `ReceptionConversation`
- `ReceptionMessage`
- `Lead`
- `Task`
- `ConversationStatus`
- `MessageSender`
- `LeadStatus`
- `TaskStatus`
- `TaskPriority`

## Reception AI flow

1. Customer message enters `POST /api/reception-ai/message`.
2. Reception AI loads the organization and Business DNA.
3. Reception AI retrieves relevant Knowledge Base chunks.
4. Reception AI calculates confidence.
5. Reception AI scores lead intent.
6. Reception AI creates or updates a conversation.
7. Reception AI stores customer and AI messages.
8. Reception AI creates a lead when buying intent is detected.
9. Reception AI creates a task when follow-up or escalation is needed.
10. Reception AI emits a business event.

## UI

The Reception AI UI lives at `/reception-ai`.

It supports:

- simulating a customer message
- seeing the generated AI response
- seeing confidence and escalation state
- seeing citations from Knowledge Base
- listing conversations
- listing generated tasks

## Validation

Expected CI commands:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next build

BUILD #007 should harden AI Employee operations:

- richer task management
- conversation lifecycle controls
- handoff to humans
- message channel adapters
- AI Gateway model integration
