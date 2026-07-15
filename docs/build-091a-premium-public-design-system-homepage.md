# Build #091A — Premium Public Design System & Homepage Redesign

**Project:** AUTOPILOT-TITUS / Autopilot One  
**Status:** public homepage redesign proposal  
**Date:** 2026-07-15  
**Scope:** homepage redesign, premium public design module, AI-first commercial positioning  
**Runtime behavior changed:** public homepage only  
**Stripe live enabled:** no  
**Tracking added:** no  
**Billing behavior changed:** no

---

## 1. Purpose

Build #091A starts the next public-site phase after the pricing polish.

The goal is to move the homepage closer to a modern SaaS competitor structure while keeping Autopilot One original, controlled and AI-first.

This build is inspired by the structure and commercial clarity of mature SaaS sites, but it does not copy Tidio or any competitor.

---

## 2. Strategic direction

The homepage now positions Autopilot One around:

- AI Website Agent;
- CRM Lite;
- lead capture;
- knowledge base;
- demo-first controlled activation;
- 95% AI automation roadmap;
- human approval gates.

The central rule remains:

```text
AI executes.
Human approves.
The system logs.
```

---

## 3. What changed

### 3.1 Homepage copy and structure

Updated `apps/web/src/components/HomeContent.tsx`.

The homepage now includes:

- hero section with AI-first positioning;
- primary CTA: website analysis;
- secondary CTAs: demo, pricing, trust;
- product-style console mockup;
- metrics strip;
- product pillars;
- customer journey flow;
- AI automation 95% section;
- use-case section;
- controlled launch / trust section;
- final CTA.

### 3.2 Premium design module

Added `apps/web/src/components/HomeContent.module.css`.

The new homepage uses a dedicated CSS module for:

- hero layout;
- product console mockup;
- metric strip;
- product cards;
- timeline flow;
- automation cards;
- trust section;
- responsive mobile polish.

This keeps the existing global CSS and avoids a CSS-in-JS migration.

### 3.3 Homepage metadata

Updated `apps/web/src/app/page.tsx`.

The metadata now reflects the AI-first positioning:

- AI Website Agent;
- CRM Lite;
- controlled AI flow;
- lead capture;
- knowledge base;
- human approvals.

---

## 4. What stayed the same

This build does not change:

- backend behavior;
- database schema;
- API routes;
- authentication;
- demo request backend;
- billing;
- Stripe live checkout;
- tracking;
- legal/company/operator details;
- pricing page behavior.

---

## 5. Required QA markers preserved

The live QA script expects the homepage to contain:

- `Un angajat AI`;
- `Cere demo`;
- `Vezi planurile`;
- `Vezi cum lucrăm sigur`;
- no `Creează cont` wording.

Build #091A preserves these markers.

---

## 6. Post-merge validation

After merge, run:

```bash
cd /opt/autopilot-one
set -euo pipefail

bash scripts/vps-stabilized-deploy.sh
```

Expected result:

```text
=== DEMO-FIRST QA PASSED ===
=== STABILIZED DEPLOY PASSED ===
```

Optional homepage text check:

```bash
curl -k -sS -L https://app.autopilot-one.com/ | grep -E "Un angajat AI|Analizează website-ul|AI Website Agent|AI executes|AI execută|Vezi planurile|Vezi cum lucrăm sigur"
```

---

## 7. Launch gating note

This build improves the homepage, but it does not mean that AI website analysis or the 95% AI autopilot are fully implemented yet.

The homepage introduces and frames the direction. The functional implementation comes in later builds:

- #092A — Product Pages;
- #093A — Website Analysis Landing Flow;
- #094A — AI Plan Recommendation Engine;
- #095A — AI Lead Qualification + Offer Drafts;
- #096A — AI Onboarding Wizard;
- #097A — AI Knowledge Base Builder;
- #098A — AI Go-live Readiness Check;
- #099A — AI Monitoring + Upgrade Recommendations.

---

## 8. Acceptance criteria

Build #091A is acceptable when:

- homepage remains HTTP 200;
- QA markers pass;
- homepage is visibly more premium and product-led;
- website-analysis CTA is present;
- AI automation 95% positioning is present;
- controlled activation/trust messaging remains clear;
- no Stripe, billing, tracking or legal/company detail changes are introduced.
