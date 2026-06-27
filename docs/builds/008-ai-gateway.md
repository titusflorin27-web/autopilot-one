# BUILD #008 — AI Gateway

Status: implemented on branch `codex/build-008-ai-gateway`.

## Scope

BUILD #008 connects Reception AI to the AI Gateway and prepares the product for model-backed response generation.

Reception AI now uses:

- Business DNA
- Knowledge Base citations
- deterministic retrieval
- AI Gateway structured generation
- safe deterministic fallback

## AI Gateway updates

`@autopilot/ai-gateway` now includes:

- `AiGateway.run`
- `AiGateway.runJson`
- `OpenAiCompatibleProvider`
- `NullAiProvider`
- provider error handling
- JSON response format support
- usage metadata support

## Reception AI model output

The model-backed output contract is structured JSON:

```ts
type ReceptionModelOutput = {
  reply: string;
  confidence: number;
  shouldEscalate: boolean;
  escalationReason?: string | null;
  leadScore?: number;
  leadSummary?: string;
  followUpTaskTitle?: string;
  followUpTaskDescription?: string;
};
```

Reception AI validates the output shape by requiring at least a valid `reply`. If the provider is missing, fails or returns invalid JSON, Reception AI uses the deterministic fallback from BUILD #006/#007.

## Environment

Provider-backed output is optional.

```env
AI_GATEWAY_PROVIDER="openai"
AI_GATEWAY_MODEL="gpt-4o-mini"
AI_GATEWAY_BASE_URL="https://api.openai.com/v1"
AI_GATEWAY_API_KEY=""
```

If `AI_GATEWAY_API_KEY` is empty, the system stays functional in fallback mode.

## Metadata

AI messages now store metadata for:

- `aiProvider`
- `aiModel`
- `aiGatewayError`
- `usedFallback`
- token usage when returned by provider

Business events also include provider/model/fallback metadata.

## UI

The `/reception-ai` UI shows:

- provider
- model
- fallback mode
- last AI mode summary

## Validation

Expected CI commands:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next build

BUILD #009 should add channel adapters:

- public web intake endpoint
- embeddable website widget
- anonymous customer conversation creation
- secure rate limits / validation
- conversion from public messages into Reception AI conversations
