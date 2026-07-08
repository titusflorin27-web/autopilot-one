# Build #089A — Client Plan Steps Section

**Project:** AUTOPILOT-TITUS / Autopilot One  
**Status:** pre-launch public pricing guidance  
**Date:** 2026-07-08  
**Scope:** explain client actions after choosing each plan  
**Runtime behavior changed:** frontend copy only  
**Stripe live enabled:** no  
**Tracking added:** no

---

## 1. Purpose

This build adds a public pricing section that explains, step by step, what the client has to do after choosing a plan.

The goal is to reduce uncertainty for prospects and make the onboarding effort feel controlled, simple and guided.

---

## 2. Product decision

The page should make clear that Autopilot One does most of the setup work, while the client only has to confirm essential information, approve AI-generated content, install or forward the widget snippet, test and approve go-live.

---

## 3. Plan-specific client steps

### Pilot

Used for initial validation before a paid plan.

Client actions:

1. Confirm website and contact details.
2. Answer a few business questions.
3. Approve the AI profile generated for testing.
4. Test one conversation and decide whether to move to Starter.

### Starter

Used for the first real AI flow on the website.

Client actions:

1. Confirm company, domain and responsible contact.
2. Add services, FAQ and main rules.
3. Approve the knowledge base created by AI.
4. Install the widget or send instructions to the developer.
5. Send a test message and approve go-live.

### Pro

Used for volume, inbox, analytics and organized follow-up.

Client actions:

1. Confirm team, roles and follow-up workflow.
2. Add extended sources and human handoff rules.
3. Test lead capture, inbox, notifications and analytics.
4. Approve launch and receive an optimization report.

### Business

Used for dedicated implementations and separately agreed commercial terms.

Client actions:

1. Define scope, volume and special requirements.
2. Confirm commercial terms and responsibilities.
3. Prepare dedicated onboarding and operating rules.
4. Launch in a controlled way after testing and final approval.

---

## 4. What did not change

This build does not:

- enable Stripe live mode;
- add checkout buttons;
- add automatic plan switching;
- change backend billing behavior;
- change database schema;
- add analytics or tracking;
- finalize legal/company/operator details.

---

## 5. Acceptance criteria

Build #089A is complete when:

- `/pricing` explains what the client has to do after choosing each plan;
- Pilot, Starter, Pro and Business each have plan-specific steps;
- the copy remains demo-first and controlled-activation compatible;
- the existing pricing QA markers remain present;
- `/pricing` remains HTTP 200 after deploy;
- no Stripe or billing runtime behavior changes are introduced.

---

## 6. Post-merge QA

Run after deploy:

```bash
cd /opt/autopilot-one
set -euo pipefail

bash scripts/vps-stabilized-deploy.sh
```

Expected markers from the live QA script must still pass:

- `Pachete clare`;
- `Activare controlată`;
- `Planurile plătite se activează prin demo înainte de plata online`;
- `Business`.

Optional visual check:

```bash
curl -k -sS -L https://app.autopilot-one.com/pricing | grep -E "Pașii clientului|Ce ai de făcut|Confirmi firma|Aprobi baza"
```

---

## 7. Next recommended build

After this public explanation section, continue with:

**Build #090A — AI Sales Autopilot Blueprint**

Scope:

- AI lead analysis;
- AI plan recommendation;
- client onboarding automation;
- approval gates;
- AI-generated offer drafts;
- post-purchase status machine.
