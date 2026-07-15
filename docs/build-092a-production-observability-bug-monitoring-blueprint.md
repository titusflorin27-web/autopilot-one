# Build #092A — Production Observability & Bug Monitoring Blueprint

**Project:** AUTOPILOT-TITUS / Autopilot One  
**Status:** pre-launch observability blueprint  
**Date:** 2026-07-15  
**Scope:** live production bug detection, alerting and operational monitoring plan  
**Runtime behavior changed:** no  
**Frontend changed:** no  
**Backend changed:** no  
**Stripe live enabled:** no  
**Tracking added:** no  
**PII collection expanded:** no

---

## 1. Purpose

Build #091A moved the public website into an AI-first, premium homepage direction.

Before adding more product pages, website analysis flows and AI automation, AUTOPILOT-TITUS needs a production observability layer that can detect bugs while the site is live and functional.

This build documents the monitoring architecture before implementation.

Goal:

```text
Detect production problems early, classify them correctly, alert the operator, and keep enough context to fix issues without exposing unnecessary personal data.
```

---

## 2. Current state

The project already has deploy-time QA.

The deploy script verifies:

- public route status;
- API health;
- key public text markers;
- robots and sitemap;
- Docker service status;
- post-warmup logs for fresh errors.

This is good for deploy validation, but it does not fully cover bugs that appear later, such as:

- frontend runtime crashes after a user interaction;
- rare API exceptions;
- demo form failures after email/provider changes;
- AI provider errors;
- slow or failing widget flows;
- production regressions after normal traffic;
- DNS/SSL/API downtime outside deploy windows.

---

## 3. Target observability layers

### 3.1 Uptime monitoring

Purpose:

- detect whether the public app, API and important surfaces are reachable;
- alert if core routes return non-200 responses;
- monitor SSL/domain availability;
- catch downtime even when no deploy is running.

Initial monitored URLs:

```text
https://app.autopilot-one.com/
https://app.autopilot-one.com/pricing
https://app.autopilot-one.com/demo
https://app.autopilot-one.com/trust
https://app.autopilot-one.com/widget-demo
https://app.autopilot-one.com/sitemap.xml
https://api.autopilot-one.com/api/health
```

Recommended implementation options:

- external uptime monitor, such as UptimeRobot or Better Stack;
- later: internal synthetic checks from the VPS or a separate runner.

Decision:

```text
Use an external uptime monitor first, because it detects problems from outside the VPS.
```

---

### 3.2 Error monitoring

Purpose:

- capture frontend runtime exceptions;
- capture backend exceptions;
- group similar errors;
- keep stack traces;
- alert the operator when a production error appears.

Recommended implementation option:

- Sentry for frontend and backend error monitoring.

Initial scope:

```text
Frontend:
- Next.js runtime errors;
- React rendering errors;
- failed client-side interactions;
- route-level crashes.

Backend:
- uncaught API exceptions;
- failed request handlers;
- provider/API errors;
- critical background processing errors.
```

Privacy rule:

```text
Do not send unnecessary personal data to external error monitoring.
Do not enable session replay before privacy/legal/cookie review.
Do not enable default PII collection by default.
```

---

### 3.3 API request correlation

Purpose:

- connect a user-facing issue to backend logs;
- identify exactly which request failed;
- make demo, widget and AI flows easier to debug.

Implementation target:

```text
Every important API request gets a requestId.
The requestId is returned in response headers.
The requestId is included in API logs.
The requestId is included in error monitoring context.
```

Suggested header:

```text
x-request-id
```

Critical flows that need correlation:

- demo request creation;
- authentication;
- public widget config;
- public widget message creation;
- AI response generation;
- lead creation;
- task creation;
- email notification send;
- billing routes later.

---

### 3.4 AI runtime monitoring

Purpose:

- detect AI provider failures;
- detect low-confidence responses;
- detect repeated handoff scenarios;
- detect cases where AI answers but no lead/task is created;
- estimate operational health of AI automation.

Initial monitored events:

```text
AI_PROVIDER_ERROR
AI_TIMEOUT
AI_LOW_CONFIDENCE
AI_HUMAN_HANDOFF
AI_LEAD_CREATED
AI_TASK_CREATED
AI_MESSAGE_CREATED
AI_RESPONSE_LATENCY_HIGH
AI_KNOWLEDGE_BASE_MISSING
```

Do not send full conversation content to external monitoring by default.

Keep operational metadata first:

```text
conversationId
organizationId
leadId if present
event type
latency bucket
provider/model identifier
confidence bucket
handoff reason
requestId
```

---

### 3.5 Business-flow monitoring

Purpose:

- detect when the business process is broken even if the site is technically online.

Critical business flows:

```text
Public visitor submits demo request
↓
DemoRequest row is created
↓
Email notification is sent to contact@autopilot-one.com
↓
CRM Lite shows the request
↓
Follow-up step/status exists
```

```text
Public visitor sends widget message
↓
ReceptionConversation is created
↓
ReceptionMessage is created
↓
AI replies or handoff is triggered
↓
Lead/task/notification is created when appropriate
```

Planned monitors:

- daily synthetic demo request check in non-destructive/test-safe mode;
- widget smoke check with test organization/token later;
- dashboard count sanity checks;
- email delivery check for Resend later.

---

## 4. Alert levels

### P0 — Production outage

Examples:

- public homepage down;
- API health down;
- SSL/domain failure;
- database unavailable;
- web container unhealthy.

Expected action:

```text
Immediate investigation.
```

### P1 — Core business flow broken

Examples:

- demo request fails;
- widget message fails;
- AI provider fails repeatedly;
- login unavailable;
- email notification failures.

Expected action:

```text
Fix before continuing feature development.
```

### P2 — Degraded behavior

Examples:

- one secondary route fails;
- slow API responses;
- high AI handoff rate;
- isolated frontend error.

Expected action:

```text
Create issue, fix in next maintenance build unless conversion is impacted.
```

### P3 — Warning / improvement

Examples:

- performance warnings;
- increasing low-confidence AI responses;
- unusual traffic or bot-like behavior;
- minor visual issue.

Expected action:

```text
Monitor and schedule polish.
```

---

## 5. Notification channels

Initial:

```text
contact@autopilot-one.com
```

Later:

```text
Telegram
Slack
Discord
internal notifications dashboard
weekly founder report
```

Rules:

- P0/P1 alerts must be immediate.
- P2 alerts can be grouped.
- P3 alerts can be summarized.
- No alert should expose secrets, tokens, full credentials or unnecessary client data.

---

## 6. Privacy and GDPR constraints

Observability must not become hidden tracking.

Until legal/cookie review is final:

```text
Do not add marketing tracking.
Do not add analytics pixels.
Do not enable session replay.
Do not collect unnecessary PII.
Do not send full conversation bodies to third-party monitoring by default.
Do not expose widget tokens, API keys or authorization headers in logs.
```

Allowed pre-launch scope:

```text
Technical error monitoring
API health checks
Uptime checks
Operational metadata
Request IDs
Error stack traces with sanitization
```

Data that must be redacted from logs/errors:

- API keys;
- auth tokens;
- widget tokens;
- cookies;
- authorization headers;
- passwords;
- raw payment details;
- personal data unless strictly necessary for debugging.

---

## 7. Implementation sequence

### Build #093A — Sentry Error Monitoring Integration

Scope:

- install Sentry SDK for Next.js/API as appropriate;
- configure environment variables;
- capture frontend and backend errors;
- keep PII disabled by default;
- add source-map support if safe for the deployment model;
- add docs for operator usage.

Acceptance:

```text
A controlled test error is visible in Sentry.
No sensitive data is included in the test error.
Deploy QA still passes.
```

### Build #094A — External Uptime Monitoring Setup

Scope:

- configure external monitors for public routes and API health;
- set contact@autopilot-one.com as initial alert channel;
- document monitor names, URLs and expected status;
- add an internal runbook.

Acceptance:

```text
Monitors exist for homepage, demo, pricing, trust, widget demo, sitemap and API health.
Alerts are configured.
No marketing tracking is introduced.
```

### Build #095A — API Logs + Request Correlation

Scope:

- add or standardize requestId generation;
- include requestId in API logs;
- return requestId in response header;
- attach requestId to known error contexts.

Acceptance:

```text
A demo request can be traced through logs with a requestId.
API health and live QA still pass.
```

### Build #096A — AI Runtime Monitoring

Scope:

- track AI provider failures;
- track low-confidence response rates;
- track handoff reasons;
- track response latency buckets;
- keep conversation content out of third-party monitoring by default.

Acceptance:

```text
AI runtime health can be reviewed without exposing full conversation contents externally.
```

---

## 8. Incident runbook

When an alert arrives:

### Step 1 — classify severity

```text
P0 outage
P1 core flow broken
P2 degraded behavior
P3 warning
```

### Step 2 — check current state

```bash
cd /opt/autopilot-one

docker compose -f infrastructure/docker-compose.vps.example.yml ps
curl -k -sS https://api.autopilot-one.com/api/health
curl -k -I https://app.autopilot-one.com/
```

### Step 3 — inspect logs

```bash
cd /opt/autopilot-one

docker compose -f infrastructure/docker-compose.vps.example.yml logs --since 30m proxy web api postgres redis
```

### Step 4 — identify recent deploy

```bash
git log -5 --oneline
```

### Step 5 — decide action

Options:

```text
fix forward
rollback to previous known-good commit
restart affected container
disable affected feature flag
pause new client activation
```

### Step 6 — document incident

Create an internal incident note with:

```text
time detected
severity
impact
root cause
fix
follow-up action
prevention
```

---

## 9. What this build does not do

This blueprint does not:

- integrate Sentry yet;
- create external uptime monitors yet;
- change runtime behavior;
- add analytics/tracking;
- enable Stripe;
- change billing;
- change legal/company details;
- collect new user data;
- send conversation content to external tools.

---

## 10. Acceptance criteria for #092A

Build #092A is complete when:

- the observability blueprint is committed;
- the monitoring layers are defined;
- alert levels are defined;
- privacy constraints are defined;
- implementation sequence #093A–#096A is defined;
- incident runbook is documented;
- no runtime behavior changes are introduced.

---

## 11. Next build

Recommended next build:

```text
Build #093A — Sentry Error Monitoring Integration
```

After #093A and #094A, feature development can continue with better production safety.
