# Build #089B — Pricing Explanation UX Polish

**Project:** AUTOPILOT-TITUS / Autopilot One  
**Status:** pre-launch pricing UX polish  
**Date:** 2026-07-09  
**Scope:** improve readability of the pricing explanation sections  
**Runtime behavior changed:** frontend copy/rendering only  
**Stripe live enabled:** no  
**Tracking added:** no

---

## 1. Purpose

Build #089A made the pricing page complete, but the explanation sections were dense.

Build #089B keeps the same commercial meaning while making the content easier to scan, especially on mobile.

---

## 2. What changed

### 2.1 Plan component explanations

The plan details section now renders each item with a short bold label followed by a concise explanation.

Example pattern:

```text
49 € / lună: Planul pentru primul agent AI activ pe website.
```

This keeps the information visible, but reduces the feeling of one large text block.

### 2.2 Client steps

The client steps section now prefixes each action with a clear step label.

Example pattern:

```text
Pasul 1: Confirmi firma, domeniul și persoana responsabilă.
```

English uses:

```text
Step 1: Confirm the company, domain and responsible contact.
```

---

## 3. What stayed the same

This build does not change:

- plan prices;
- plan limits;
- plan names;
- demo-first activation;
- Stripe status;
- billing behavior;
- backend behavior;
- database schema;
- tracking;
- legal/company/operator details.

---

## 4. Acceptance criteria

Build #089B is complete when:

- `/pricing` keeps the #089A explanations;
- plan component explanations are easier to scan;
- client steps are numbered clearly;
- the existing QA markers remain present;
- `/pricing` remains HTTP 200 after deploy;
- no Stripe/billing/tracking behavior is introduced.

---

## 5. Post-merge QA

Run after merge:

```bash
cd /opt/autopilot-one
set -euo pipefail

bash scripts/vps-stabilized-deploy.sh
```

Expected markers must still pass:

- `Pachete clare`;
- `Activare controlată`;
- `Planurile plătite se activează prin demo înainte de plata online`;
- `Business`.

Optional visual check:

```bash
curl -k -sS -L https://app.autopilot-one.com/pricing | grep -E "Ce reprezintă fiecare element|Pasul 1|Widget \+ lead capture|Setup ghidat|Dashboard operațional"
```

---

## 6. Next recommended build

After this polish, continue with internal founder-only documentation:

**Build #090A — Internal Operations Manual**

Scope:

- internal services and subscriptions;
- operational cost checklist;
- where each service is used;
- what happens if a service fails;
- deploy/recovery procedures;
- no secrets stored in the repository.
