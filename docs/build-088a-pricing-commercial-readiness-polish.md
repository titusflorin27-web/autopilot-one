# Build #088A — Pricing Commercial Readiness Polish

**Project:** AUTOPILOT-TITUS / Autopilot One  
**Status:** controlled B2B commercial readiness polish  
**Date:** 2026-07-08  
**Scope:** pricing copy clarity for manual demo-first sales  
**Runtime behavior changed:** no backend or billing behavior change  
**Stripe live enabled:** no  
**Tracking added:** no

---

## 1. Purpose

This build makes the public pricing page clearer for controlled B2B sales before Stripe live checkout and final company/legal data are completed.

The goal is not to launch automated paid self-serve billing. The goal is to make pricing safe and understandable for prospects who view the page before requesting a demo.

---

## 2. Commercial posture

Current posture after this build:

- plans are suitable for commercial discussion;
- activation remains manual after demo;
- no online checkout is enabled by this build;
- no automatic overage billing is implied;
- final billing and commercial terms are confirmed manually;
- Stripe remains gated until final company/legal/fiscal readiness.

---

## 3. Public pricing adjustments

### 3.1 Pilot instead of generic Free

The former Free display is presented as a **Pilot** validation offer on the pricing cards.

Reason:

- avoids implying a permanent free production plan;
- keeps the zero-price option useful for validation;
- improves B2B commercial positioning.

### 3.2 Monthly limits clarified

Widget message limits are shown as monthly limits, not generic "per period" limits.

Examples:

- `100 mesaje widget / lună`;
- `1.000 mesaje widget / lună`;
- `10.000 mesaje widget / lună`;
- `50.000 mesaje widget / lună`.

English copy mirrors this as `widget messages / month`.

### 3.3 Knowledge sources clarified

Knowledge source limits are clarified as pages, documents or knowledge base entries.

Reason:

- prospects understand what a source means;
- reduces sales friction;
- avoids vague SaaS terminology.

### 3.4 Activation and overage notes added

The pricing page now explains:

- activation happens after demo;
- pricing, plan and billing are confirmed manually;
- setup is guided during controlled launch;
- overages trigger manual upgrade/adjustment, not automatic extra charges without confirmation.

---

## 4. What did not change

This build does not:

- enable Stripe live mode;
- add checkout buttons;
- add automatic plan switching;
- change API billing behavior;
- change database schema;
- add analytics or tracking;
- finalize public legal pages;
- insert company/operator details.

---

## 5. Acceptance criteria

Build #088A is complete when:

- pricing page no longer uses unclear `/ period` wording for widget message limits;
- the 0 EUR plan is positioned as validation/pilot, not an open-ended production free plan;
- pricing page explains controlled activation after demo;
- pricing page clarifies knowledge sources;
- pricing page explains that overages are handled manually;
- no Stripe or billing runtime behavior changes are introduced;
- `/pricing` remains HTTP 200 after deploy;
- public demo CTA remains available.

---

## 6. Post-merge QA

Run after deploy:

```bash
cd /opt/autopilot-one
set -euo pipefail

APP_URL="https://app.autopilot-one.com"
TMP_DIR="/tmp/autopilot-pricing-088a"
mkdir -p "$TMP_DIR"

curl -k -sS -L -H 'Cache-Control: no-cache' -o "$TMP_DIR/pricing.html" "$APP_URL/pricing?pricing088a=$(date +%s)"

grep -F "Pilot" "$TMP_DIR/pricing.html"
grep -F "mesaje widget / lună" "$TMP_DIR/pricing.html"
grep -F "activare manuală" "$TMP_DIR/pricing.html"
grep -F "taxare automată" "$TMP_DIR/pricing.html"

echo "=== PRICING 088A COPY CHECK PASSED ==="
```

If the rendered HTML does not contain the expected Romanian text because the page is hydrated client-side, verify visually in the browser and use the route status check instead:

```bash
curl -k -sS -I https://app.autopilot-one.com/pricing | head
```

---

## 7. Next recommended steps

1. Deploy and verify `/pricing` visually.
2. Keep Stripe disabled until final company/operator/legal/fiscal readiness.
3. After first client conversation, refine wording based on real objections.
4. Later: Build #089A — Stripe live readiness.
