# BUILD #017 — Billing / Plans / Usage Limits

Status: implemented on branch `codex/build-017-billing-usage`.

## Scope

BUILD #017 adds the first billing and usage-readiness layer.

This is not Stripe integration yet. It creates the product surface and data model needed before real payment processing.

## Data model

New enums:

```prisma
enum BillingPlan {
  FREE
  STARTER
  PRO
  BUSINESS
}

enum BillingStatus {
  TRIALING
  ACTIVE
  PAST_DUE
  CANCELLED
}
```

`Organization` now includes:

- `billingPlan`
- `billingStatus`
- `billingCurrentPeriodStart`

## Plan limits

Initial MVP limits:

| Plan | Widget messages | Knowledge sources | Team members |
| --- | ---: | ---: | ---: |
| FREE | 100 | 5 | 1 |
| STARTER | 1,000 | 50 | 3 |
| PRO | 10,000 | 500 | 10 |
| BUSINESS | 50,000 | 2,000 | 50 |

## API

Protected endpoints:

```http
GET /api/billing/organization/:organizationId
PATCH /api/billing/organization/:organizationId/plan
```

The overview endpoint returns:

- organization billing state
- plan limits
- current usage
- remaining quota
- over-limit flags
- available plans

## UI

New page:

```http
/billing
```

Included:

- current plan
- billing status
- usage cards
- remaining limits
- plan cards
- manual plan switching for MVP/demo use

## Validation

Expected CI commands:

```bash
pnpm install --frozen-lockfile=false
pnpm db:generate
pnpm typecheck
pnpm build
```

## Next build

BUILD #018 should add production readiness:

- stronger CORS defaults
- deployment env docs
- Redis-backed rate limit plan
- production checklist
- logging and health visibility improvements
