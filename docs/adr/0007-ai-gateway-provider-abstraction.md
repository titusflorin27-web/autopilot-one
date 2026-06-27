# ADR 0007 — AI Gateway Provider Abstraction

## Status

Accepted for BUILD #008.

## Context

Reception AI needs model-backed response generation, but the product must remain usable without a provider API key during local development, CI and early demos.

Autopilot One also needs an abstraction that can support multiple providers later without embedding provider-specific logic inside business modules.

## Decision

Extend `@autopilot/ai-gateway` with a provider abstraction and connect Reception AI through it.

The first provider implementation is OpenAI-compatible chat completions, configured by environment variables:

- `AI_GATEWAY_PROVIDER`
- `AI_GATEWAY_MODEL`
- `AI_GATEWAY_BASE_URL`
- `AI_GATEWAY_API_KEY`

Reception AI requests structured JSON output. The service validates that a model response contains at least a usable `reply`. If not, it uses the deterministic fallback path.

## Consequences

Positive:

- Reception AI can use real model output when configured.
- Local development and CI remain stable without secrets.
- Provider details stay outside core business logic.
- Future AI Employees can reuse the same gateway pattern.

Tradeoffs:

- Prompt and structured output validation are still simple.
- No retry/backoff policy yet.
- No provider-level observability dashboard yet.
- No streaming support yet.

## Follow-up

Future builds should add:

- stronger schema validation for model responses
- provider retries and timeouts
- prompt version registry
- AI usage reporting
- model/provider settings per organization
- streaming responses for chat UI
