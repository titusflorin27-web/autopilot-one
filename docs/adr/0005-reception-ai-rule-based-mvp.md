# ADR 0005 — Reception AI Rule-Based MVP

## Status

Accepted for BUILD #006.

## Context

Reception AI is the first AI Employee in Autopilot One. It needs to demonstrate the product loop before external model integration is required:

- read Business DNA
- retrieve Knowledge Base context
- respond to a customer
- detect lead intent
- create tasks
- escalate risky cases

The AI Gateway package exists, but production model-provider integration is not required for this build.

## Decision

Implement Reception AI as a deterministic, rule-based MVP service that uses Business DNA and Knowledge Base retrieval as inputs.

The service persists:

- conversations
- messages
- leads
- tasks
- events

The response shape already includes fields expected from a future model-backed AI Employee:

- reply
- confidence
- escalation flag
- lead reference
- task reference
- citations

## Consequences

Positive:

- Validates the end-to-end AI Employee workflow immediately.
- Keeps BUILD #006 reliable and dependency-light.
- Creates database primitives needed by future AI Employees.
- Keeps the API compatible with future model-backed implementations.

Tradeoffs:

- The response generation is not yet powered by an LLM.
- Lead scoring is heuristic.
- Escalation is based on static risk signals and confidence thresholds.

## Follow-up

Future builds should connect Reception AI to AI Gateway and add:

- provider-backed response generation
- prompt templates
- structured output validation
- human handoff lifecycle
- channel adapters for web chat, email and messaging platforms
