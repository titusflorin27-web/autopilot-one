# Build 084A - Final Pre-Client Public Audit

## Status

AUTOPILOT-TITUS is in pre-launch audit and polish.

This audit does not declare the product fully launched. It separates what is ready for controlled pre-client demo conversations from what still blocks a public paid launch.

## Scope reviewed

- Homepage positioning and CTAs
- Pricing and activation copy
- Demo request flow
- Trust page
- Legal pages
- Footer and public navigation
- SEO metadata and sitemap routes
- Billing public surface
- Stripe readiness gates

## Current strategic position

The public product should remain demo-first:

1. visitor requests demo;
2. use case is validated;
3. workspace is configured in a controlled way;
4. paid activation happens only after commercial and legal readiness;
5. Stripe checkout is enabled only through explicit configuration.

## OK for controlled pre-client demo

### Homepage

The homepage is aligned with the demo-first strategy. The primary CTA points to `/demo`; supporting CTAs point to `/pricing` and `/trust`.

### Pricing

Pricing is clear enough for pre-client review. Paid plans are visible, but the page states that paid plans are activated through demo before online payment.

### Demo

The demo page explains the validation conversation, expected outcomes, privacy link and no-card/no-obligation position.

### Trust

The Trust page explains:

- what the AI does;
- what is not promised;
- how risk is reduced;
- payment and activation positioning;
- the controlled launch process.

### Footer and navigation

The Trust page is linked from navigation, footer and sitemap.

### Billing

Billing UI and backend now protect the payment flow:

- checkout is only available if the payment provider says checkout is enabled;
- Business plan does not use self-serve checkout;
- unavailable checkout sends users to demo/request flow;
- Stripe checkout requires explicit feature readiness.

### QA

The official VPS QA script now checks the demo-first strategy and current public route set.

## Launch blockers before public paid launch

### 1. Company/operator details

The legal pages still use a generic commercial operator reference. This is acceptable only as a temporary pre-client audit state.

Before public paid launch, add final company/operator details:

- legal name;
- registration number / CUI or equivalent;
- registered address;
- commercial contact email;
- jurisdiction;
- invoicing/fiscal position;
- applicable support/refund contact path.

### 2. Final legal review

Privacy, Terms, Refund Policy, Consumer Rights and Cookies pages should be reviewed with the real operator data and actual commercial setup.

### 3. Stripe live activation

Stripe should remain prepared but not publicly live until these are complete:

- business identity;
- Stripe account verified;
- STARTER and PRO price IDs configured;
- refund/cancellation policy final;
- billing copy final;
- customer portal tested;
- webhook secrets verified;
- `STRIPE_CHECKOUT_ENABLED=true` intentionally set.

### 4. Tracking decision

Marketing tracking is not currently active. Do not add analytics, ads pixels, retargeting or session recording without a separate consent/cookie decision.

## Recommended next polish before outreach

### P1 - Lead follow-up operating flow

Define what happens after a demo request:

- who receives it;
- response time target;
- qualification questions;
- follow-up sequence;
- CRM/n8n automation path.

### P1 - Final company data placeholders

Prepare a single checklist for final company data insertion so legal pages can be completed quickly when the company details are ready.

### P2 - English SEO architecture

The current website supports English copy client-side, but canonical SEO remains Romanian-first. This is acceptable for a Romania-first launch, but `/en` routes and hreflang should be considered later for international SEO.

### P2 - Public proof assets

Do not invent customers. Add case studies, testimonials and logos only after real pilots exist.

## Go / No-Go

### Controlled pre-client demo

GO.

The public site is coherent enough for controlled conversations, demo requests and private pilot validation.

### Public paid launch with self-serve Stripe checkout

NO-GO until the launch blockers above are closed.

## Next recommended build

Build 085A - Demo Request Follow-Up Operating Flow.

Purpose: define and implement the operational process after a visitor submits a demo request, including notification, qualification and follow-up readiness.
