# ADR 0003 — Business DNA JSON Contract

## Status

Accepted for BUILD #004.

## Context

Autopilot One needs a company-level source of truth that AI Employees can read before they execute work.

The product roadmap requires the company to describe products, services, rules, tone, FAQ and objectives. This context will be reused by Reception AI, Knowledge Base retrieval, dashboard activity and future AI Employees.

## Decision

Store Business DNA as structured JSON on `Organization.businessDna`, while defining a shared TypeScript contract in `packages/shared`.

The contract is intentionally explicit:

- `summary`
- `products`
- `services`
- `rules`
- `tone`
- `faq`
- `objectives`

The API exposes:

- `GET /api/business-dna/:organizationId`
- `PUT /api/business-dna`

Authorization remains organization-scoped through `Membership` and RBAC.

## Consequences

Positive:

- Fast to iterate during MVP.
- No schema migration is needed for every Business DNA field adjustment.
- Frontend and backend share the same TypeScript contract.
- Reception AI can consume a predictable context object in BUILD #006.

Tradeoffs:

- PostgreSQL cannot enforce every nested field.
- Validation must happen in the application layer.
- Reporting over nested Business DNA fields will require JSON querying or future normalization.

## Follow-up

Before scale-up, evaluate whether high-value fields should be normalized into dedicated tables, especially products, services and FAQ items if they become searchable Knowledge Base primitives.
