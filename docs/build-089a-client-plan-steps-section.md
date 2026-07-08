# Build #089A — Client Plan Steps Section

**Project:** AUTOPILOT-TITUS / Autopilot One  
**Status:** pre-launch public pricing guidance  
**Date:** 2026-07-08  
**Scope:** explain client actions and plan components after choosing each plan  
**Runtime behavior changed:** frontend copy only  
**Stripe live enabled:** no  
**Tracking added:** no

---

## 1. Purpose

This build adds public pricing sections that explain two things clearly:

1. what each part of every plan means;
2. what the client has to do after choosing each plan.

The goal is to reduce uncertainty for prospects and make the onboarding effort feel controlled, simple and guided.

---

## 2. Product decision

The page should make clear that Autopilot One does most of the setup work, while the client only has to confirm essential information, approve AI-generated content, install or forward the widget snippet, test and approve go-live.

It should also explain each plan component in plain language, so the client understands terms such as widget messages, knowledge sources, team members, AI receptionist flow, inbox, analytics and custom onboarding.

---

## 3. Plan component explanations

### Pilot

Explains:

- `0 € / validation` as controlled validation, not a permanent free production plan;
- `100 widget messages / month` as a testing conversation limit;
- `5 knowledge sources` as a small set of verified AI context sources;
- `1 team member` as one responsible tester/contact;
- basic AI receptionist flow as simple replies and contact capture;
- no-card validation as a test before commercial activation.

### Starter

Explains:

- `49 € / month` as the first paid website AI flow;
- `1,000 widget messages / month` as suitable starter production volume;
- `50 knowledge sources` as pages, FAQs, docs or KB entries;
- `3 team members` as owner plus up to two team members;
- website widget and lead capture as the live website intake flow;
- guided setup as preparation of profile, sources, widget and final test.

### Pro

Explains:

- `99 € / month` as a plan for active teams;
- `10,000 widget messages / month` as higher-volume usage;
- `500 knowledge sources` as an extended operating knowledge base;
- `10 team members` as support for broader internal work;
- inbox, analytics and human handoff as the operating layer;
- dashboard as visibility into conversations, leads, notifications and optimization.

### Business

Explains:

- custom pricing based on volume, complexity and support;
- `50,000 widget messages / month` as indicative high-volume capacity;
- `2,000 knowledge sources` as extended documentation and process coverage;
- `50 team members` as support for larger teams;
- custom onboarding and operating model as setup around the client's real process;
- separate commercial terms as contractually confirmed support, responsibilities and activation.

---

## 4. Plan-specific client steps

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

## 5. What did not change

This build does not:

- enable Stripe live mode;
- add checkout buttons;
- add automatic plan switching;
- change backend billing behavior;
- change database schema;
- add analytics or tracking;
- finalize legal/company/operator details.

---

## 6. Acceptance criteria

Build #089A is complete when:

- `/pricing` explains what each plan component means;
- `/pricing` explains what the client has to do after choosing each plan;
- Pilot, Starter, Pro and Business each have plan-specific component explanations;
- Pilot, Starter, Pro and Business each have plan-specific client steps;
- the copy remains demo-first and controlled-activation compatible;
- the existing pricing QA markers remain present;
- `/pricing` remains HTTP 200 after deploy;
- no Stripe or billing runtime behavior changes are introduced.

---

## 7. Post-merge QA

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
curl -k -sS -L https://app.autopilot-one.com/pricing | grep -E "Explicația planurilor|Ce reprezintă fiecare element|Pașii clientului|Ce ai de făcut|Confirmi firma|Aprobi baza"
```

---

## 8. Next recommended build

After this public explanation section, continue with:

**Build #090A — AI Sales Autopilot Blueprint**

Scope:

- AI lead analysis;
- AI plan recommendation;
- client onboarding automation;
- approval gates;
- AI-generated offer drafts;
- post-purchase status machine.
