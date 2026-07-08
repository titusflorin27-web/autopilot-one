# Build #087A — SEO Schema + Search Console Checklist

**Project:** AUTOPILOT-TITUS / Autopilot One  
**Status:** internal SEO pre-launch operating pack  
**Date:** 2026-07-08  
**Scope:** structured data plan, Search Console setup, sitemap submission and SEO QA for controlled B2B demo launch  
**Public pages changed:** no  
**Runtime code changed:** no  
**Tracking added:** no

---

## 1. Purpose

This document defines the SEO operating checklist for the next controlled pre-launch stage.

It does not implement schema markup in runtime code yet. The current build prepares the structure, validation process and exact decision gates so schema can be added safely after the final company/operator and legal details are confirmed.

The immediate goal is not aggressive traffic growth. The goal is a clean, verifiable search baseline before outreach:

1. Search Console property verified.
2. Sitemap submitted and monitored.
3. Public routes indexable where appropriate.
4. Structured data plan ready.
5. No marketing tracking or analytics added before the cookie/tracking decision.

---

## 2. Official SEO references

Primary references used for this pack:

- Google Search Central — structured data introduction: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Google Search Central — learn about sitemaps: https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview
- Google Search Central — build and submit a sitemap: https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap
- Google Search Console Help — verify site ownership: https://support.google.com/webmasters/answer/9008080
- Google Rich Results Test: https://search.google.com/test/rich-results
- Schema.org vocabulary: https://schema.org/

Operational rule: Google Search Central guidance is the source of truth for Google Search behavior. Schema.org can be used as vocabulary reference, but markup should still follow Google’s search documentation and quality guidelines.

---

## 3. Current SEO posture

Current known posture from earlier builds:

- public app domain: `https://app.autopilot-one.com`;
- public API domain: `https://api.autopilot-one.com`;
- public route QA includes `/`, `/pricing`, `/trust`, `/demo`, `/privacy`, `/cookies`, `/terms`, `/refund-policy`, `/consumer-rights`, `/widget-demo`, `/login`, `/register`;
- `robots.txt` is part of VPS QA;
- `sitemap.xml` is part of VPS QA;
- `/trust` is included in the sitemap after Build #080B/#082A;
- public funnel is demo-first;
- paid Stripe checkout is not public-live until final readiness;
- analytics/tracking pixels are not enabled.

Current SEO constraints:

1. Company/operator details are not final.
2. Public legal pages are not final legal documents.
3. There are no real customer logos, case studies or testimonials yet.
4. English visible copy exists through client-side language preference, but canonical public SEO remains one route set, not full `/en` architecture.
5. No marketing tracking should be added before cookie/tracking approval.

---

## 4. SEO implementation principle

For this stage, SEO must be conservative and truthful.

Allowed:

- submit existing public sitemap;
- verify Search Console ownership;
- inspect indexing status;
- validate metadata and canonical routes;
- prepare JSON-LD templates;
- add structured data later only when visible page content and business identity are stable.

Not allowed yet:

- claiming customer reviews, ratings, awards, case studies or market leadership;
- adding fake FAQ content only for schema;
- adding Organization details that depend on final company data;
- adding Google Analytics, Meta Pixel, Hotjar, LinkedIn Insight Tag, retargeting pixels or session replay;
- adding SEO pages with thin or duplicate content.

---

## 5. Search Console property plan

Recommended property setup:

### 5.1 Primary property

Use a **Domain property** for:

```text

autopilot-one.com
```

Reason:

- covers subdomains such as `app.autopilot-one.com` and `api.autopilot-one.com`;
- works well because DNS access already exists in DigitalOcean;
- avoids adding tracking tags or Analytics just for verification.

Verification method:

```text
DNS TXT record from Search Console
```

Operational notes:

- use the exact TXT value provided by Search Console;
- add it in DigitalOcean DNS;
- DNS verification may take time;
- keep the verification record after successful verification.

### 5.2 Optional URL-prefix property

Add a URL-prefix property only if needed for narrower reporting:

```text
https://app.autopilot-one.com/
```

Preferred verification for URL-prefix if DNS property is not enough:

1. HTML tag method in the `<head>` of the public homepage; or
2. HTML file upload at site root if static serving supports it.

Avoid using Google Analytics or Google Tag Manager as verification methods until tracking is approved.

---

## 6. Sitemap submission workflow

Primary sitemap URL:

```text
https://app.autopilot-one.com/sitemap.xml
```

Submission flow:

1. Verify `autopilot-one.com` as Domain property.
2. Open Search Console.
3. Select the `autopilot-one.com` property.
4. Go to **Sitemaps**.
5. Submit:

```text
https://app.autopilot-one.com/sitemap.xml
```

6. Confirm Search Console shows the sitemap as submitted.
7. Re-check after Google processes it.
8. Watch for parsing errors, blocked URLs, redirected URLs or unexpected protected routes.

Robots cross-check:

- `https://app.autopilot-one.com/robots.txt` should be reachable;
- it should reference the sitemap;
- protected app routes should not be intended as public SEO entry points.

Important: sitemap submission helps discovery, but does not guarantee indexing.

---

## 7. URL index priority list

### P0 — inspect first

```text
https://app.autopilot-one.com/
https://app.autopilot-one.com/demo
https://app.autopilot-one.com/pricing
https://app.autopilot-one.com/trust
```

### P1 — legal/support pages

```text
https://app.autopilot-one.com/privacy
https://app.autopilot-one.com/cookies
https://app.autopilot-one.com/terms
https://app.autopilot-one.com/refund-policy
https://app.autopilot-one.com/consumer-rights
```

### P2 — utility/demo routes

```text
https://app.autopilot-one.com/widget-demo
https://app.autopilot-one.com/login
https://app.autopilot-one.com/register
```

Notes:

- `/widget-demo` is useful for public technical demonstration, but should not become the main SEO landing page.
- `/login` and `/register` may be indexable, but they are not primary acquisition URLs.
- protected pages such as `/dashboard`, `/inbox`, `/knowledge-base`, `/billing`, `/reception-ai`, `/notifications` should not be treated as public SEO landing pages.

---

## 8. Structured data plan

Structured data must match visible page content. Do not add structured data for content that is not visible to users.

Recommended staged approach:

### Stage 1 — safe after final public copy review

Add JSON-LD for:

1. `WebSite` on homepage.
2. `Organization` with conservative brand-level details.
3. `SoftwareApplication` or `WebApplication` for the product.
4. `BreadcrumbList` for public pages if routing hierarchy is expanded.

### Stage 2 — after final company/operator data

Enhance `Organization` with:

- legal name;
- sameAs links;
- logo URL;
- contact point;
- jurisdiction/address only if final and public.

### Stage 3 — only after real public FAQ content exists

Add `FAQPage` only to pages that visibly contain the same questions and answers.

Do not add FAQ schema for internal docs, hidden content or marketing claims that are not displayed.

---

## 9. Draft JSON-LD templates

These templates are not to be pasted into production unchanged. They are planning references.

### 9.1 WebSite

```json
{
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Autopilot One",
  "url": "https://app.autopilot-one.com/",
  "inLanguage": "ro-RO"
}
```

### 9.2 Organization — pre-final safe version

```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Autopilot One",
  "url": "https://app.autopilot-one.com/",
  "email": "contact@autopilot-one.com"
}
```

Do not add legal entity name, registration number, address or founder details until approved for publication.

### 9.3 SoftwareApplication / WebApplication

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Autopilot One",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "url": "https://app.autopilot-one.com/",
  "description": "AI receptionist and CRM Lite for B2B websites, lead capture, conversation management and human follow-up.",
  "offers": {
    "@type": "Offer",
    "availability": "https://schema.org/PreOrder",
    "url": "https://app.autopilot-one.com/demo"
  }
}
```

Use caution with `offers`. Because public paid self-serve checkout is not live, schema should point to the demo/controlled activation flow, not imply instant online purchase.

### 9.4 FAQPage — only after visible FAQ section exists

```json
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "Ce face Autopilot One?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Autopilot One oferă un recepționer AI pentru website, captare lead-uri, inbox, CRM Lite și follow-up operațional."
      }
    }
  ]
}
```

Only add FAQ schema if the exact Q&A is visible on the same page.

---

## 10. Metadata checklist

For every public page, confirm:

- unique title;
- unique description;
- canonical URL;
- no accidental `noindex`;
- title and visible H1 are aligned;
- page has one clear primary search intent;
- CTA does not contradict the demo-first strategy;
- legal/Stripe/tracking promises match current launch state.

Current page intent map:

| Route | Search intent | Primary CTA | Schema candidate |
| --- | --- | --- | --- |
| `/` | AI receptionist / AI website lead capture | `/demo` | WebSite, Organization, SoftwareApplication |
| `/demo` | request demo / AI receptionist demo | form submit | SoftwareApplication reference, breadcrumb |
| `/pricing` | AI receptionist pricing / CRM Lite plans | `/demo` | Offer only after commercial wording is final |
| `/trust` | AI safety, controlled launch, trust | `/demo` | FAQPage only if visible FAQ is added |
| `/privacy` | privacy/GDPR | none or contact | none or Organization reference |
| `/cookies` | cookie policy | none or privacy | none |
| `/terms` | terms and conditions | none/contact | none |
| `/refund-policy` | refund policy | contact | none |
| `/consumer-rights` | consumer information | contact | none |

---

## 11. Search Console operating checklist

After property verification:

1. Submit sitemap.
2. Use URL Inspection for P0 URLs.
3. Confirm Google sees the canonical URL expected.
4. Confirm page is not blocked by robots.
5. Confirm rendered HTML includes title/description/H1 and public content.
6. Request indexing only for P0 pages first.
7. Wait before bulk-requesting secondary pages.
8. Check **Pages / Indexing** report after a few days.
9. Record errors and warnings in a project note.
10. Do not panic if indexing is delayed; new sites and subdomains may take time.

Minimum first-report metrics to monitor:

- indexed pages;
- discovered but not indexed;
- crawled but not indexed;
- excluded by `noindex`;
- blocked by robots.txt;
- duplicate without user-selected canonical;
- sitemap parsing errors;
- rich result validation after schema is implemented.

---

## 12. SEO QA commands for VPS

Use these after merge/sync to confirm the live SEO surface. They are read-only.

```bash
cd /opt/autopilot-one
set -euo pipefail

APP_URL="https://app.autopilot-one.com"
TMP_DIR="/tmp/autopilot-seo-087a"
mkdir -p "$TMP_DIR"

echo "=== SEO ROUTE STATUS ==="
for path in / /demo /pricing /trust /privacy /cookies /terms /refund-policy /consumer-rights /widget-demo /login /register; do
  code="$(curl -k -sS -L -H 'Cache-Control: no-cache' -o "$TMP_DIR/$(echo "$path" | sed 's#/#_#g; s#^_$#home#').html" -w "%{http_code}" "$APP_URL$path?seo087a=$(date +%s)" || true)"
  echo "$path code=$code"
  [ "$code" = "200" ] || exit 1
done

echo "=== ROBOTS ==="
curl -k -sS "$APP_URL/robots.txt" | tee "$TMP_DIR/robots.txt"
grep -F "Sitemap: $APP_URL/sitemap.xml" "$TMP_DIR/robots.txt"

echo "=== SITEMAP ==="
curl -k -sS "$APP_URL/sitemap.xml" | tee "$TMP_DIR/sitemap.xml" >/dev/null
for url in "$APP_URL/" "$APP_URL/demo" "$APP_URL/pricing" "$APP_URL/trust"; do
  grep -F "$url" "$TMP_DIR/sitemap.xml"
done

echo "=== NO TRACKING SCRIPT QUICK CHECK ==="
for file in "$TMP_DIR"/*.html; do
  if grep -Ei "googletagmanager|google-analytics|gtag\(|fbq\(|hotjar|linkedin insight|clarity" "$file"; then
    echo "Unexpected tracking snippet found in $file" >&2
    exit 1
  fi
done

echo "=== SEO 087A READ-ONLY CHECK PASSED ==="
```

---

## 13. Content backlog for search growth

Do not create thin pages. Add content only when it is specific, useful and accurate.

Recommended future pages:

1. `/use-cases/ai-receptionist`
   - what it does, handoff limits, industries, examples.
2. `/use-cases/lead-capture-ai`
   - lead capture, CRM Lite, follow-up workflow.
3. `/industries/clinics`
   - only after real or strongly validated clinic workflow exists.
4. `/industries/local-services`
   - service businesses with repetitive questions.
5. `/resources/ai-widget-implementation-checklist`
   - public implementation checklist, no secret details.
6. `/compare/autopilot-one-vs-chatbot`
   - careful, factual comparison; avoid unsupported claims.

Content rules:

- no fake customers;
- no fake revenue numbers;
- no invented case studies;
- no guarantee wording;
- no legal/medical/financial autonomous decision claims;
- do not over-index unfinished features.

---

## 14. Analytics and tracking decision

No analytics or marketing tracking is added in Build #087A.

Tracking remains blocked until:

1. cookie/tracking legal decision is made;
2. public cookie policy is updated if required;
3. consent mechanism is selected if optional tracking is used;
4. processor list is updated;
5. GDPR operating pack is updated with the new processor and purpose.

Allowed without tracking:

- Search Console verification via DNS;
- Search Console sitemap submission;
- manual URL inspection;
- server-side operational logs already needed for security and debugging.

---

## 15. Implementation options after this build

### Option A — Documentation only now, code later

Pros:

- safest with company data still pending;
- avoids publishing incomplete Organization data;
- no deploy risk;
- aligns with GDPR/legal gating.

Cons:

- structured data is not yet live.

Recommended now: **yes**.

### Option B — Add minimal WebSite + SoftwareApplication JSON-LD now

Pros:

- starts schema validation earlier;
- low legal exposure if conservative.

Cons:

- needs runtime code and deploy;
- SoftwareApplication/Offer wording needs care while Stripe is not live.

Recommended later: yes, after final copy review.

### Option C — Add full Organization + FAQ + Offer schema now

Pros:

- richer SEO surface.

Cons:

- unsafe before company/operator data and visible FAQ finalization;
- higher risk of misleading structured data.

Recommended now: **no**.

---

## 16. Acceptance criteria for Build #087A

Build #087A is complete when:

- this document exists at `docs/build-087a-seo-schema-search-console-checklist.md`;
- Search Console property plan is defined;
- sitemap submission workflow is defined;
- public URL index priority is defined;
- structured data stages and templates are documented;
- tracking remains blocked;
- no public page, runtime code, legal text or Stripe behavior is changed;
- the next implementation gate is clear.

---

## 17. Next recommended builds

1. **Build #087B — Minimal JSON-LD implementation**
   - add `WebSite` and conservative `SoftwareApplication` JSON-LD;
   - validate with Rich Results Test;
   - deploy only after final copy review.

2. **Build #088A — Legal public pages finalization**
   - insert final company/operator details;
   - update public privacy/terms/cookies;
   - add DPA availability note.

3. **Build #089A — Stripe live readiness**
   - verify company data;
   - configure live price IDs;
   - test webhook/security;
   - enable checkout intentionally.
