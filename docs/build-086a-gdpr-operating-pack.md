# Build #086A — GDPR Operating Pack

**Project:** AUTOPILOT-TITUS / Autopilot One  
**Status:** internal pre-launch operating pack  
**Date:** 2026-07-08  
**Scope:** GDPR operational readiness for controlled B2B demo launch  
**Public pages changed:** no  
**Runtime code changed:** no

---

## 1. Purpose

This document defines the internal GDPR operating model for Autopilot One before controlled B2B demos.

It is not the final public Privacy Policy, Terms, Cookie Policy, or legal DPA. It is the working pack used to align product, operations, customer onboarding, and legal review.

The public legal pages must remain generic until final company/operator details are inserted and reviewed.

---

## 2. Legal baseline references

Primary references used for this operating pack:

- Regulation (EU) 2016/679, General Data Protection Regulation: https://eur-lex.europa.eu/eli/reg/2016/679/oj
- European Commission, rules for businesses and organisations: https://commission.europa.eu/law/law-topic/data-protection/rules-business-and-organisations_en
- EDPB Guidelines 07/2020 on controller and processor concepts: https://www.edpb.europa.eu/documents/guideline/guidelines-072020-on-the-concepts-of-controller-and-processor-in-the-gdpr_en

Internal interpretation in this pack is operational guidance, not legal advice. Final external wording needs legal review before paid self-serve launch.

---

## 3. Current launch constraints

Autopilot One is approved for controlled demo operations, not fully automated paid self-serve launch.

Blocked until final stage:

1. Company/operator identity details.
2. Legal review of Privacy Policy, Terms, Cookies, and DPA.
3. Final DPA/subprocessor references.
4. Stripe live activation and billing wording.
5. Tracking/cookie decision.
6. Retention and deletion process confirmed operationally.

Current product posture:

- Demo-first acquisition.
- Manual B2B activation.
- No public promise of guaranteed outcomes.
- No marketing tracking enabled yet.
- Stripe guarded until readiness flags and company data are complete.

---

## 4. Role model

### 4.1 Autopilot One as controller

Autopilot One is likely controller for:

- visitors and prospects on Autopilot One public pages;
- demo requests submitted through `/demo`;
- user account registration and authentication;
- billing and customer administration;
- security logs and abuse prevention;
- operational email notifications sent by Autopilot One.

### 4.2 Autopilot One as processor

For a client website using the widget, the client may be the controller for its own website visitor data, and Autopilot One may act as processor for:

- visitor chat messages;
- lead capture through the AI widget;
- conversation summaries;
- lead scoring and handoff tasks;
- support/inbox workflow operated on behalf of the client.

### 4.3 Mixed role cases

Some flows may have mixed roles and require final legal wording:

- security monitoring;
- fraud/abuse prevention;
- billing and payment records;
- aggregated product analytics;
- AI service improvement, if ever introduced.

Default rule before legal review: do not claim AI training or product-improvement use of customer content unless explicitly approved and documented.

---

## 5. Data inventory

| Flow | Personal data | Source / data subject | Purpose | Candidate legal basis | Storage / system | Processors | Retention proposal | Risk / action |
| --- | --- | --- | --- | --- | --- | --- | --- | --- |
| Demo request | name, email, phone, company, website, message, source, status, internal note, next step, follow-up date | prospect | respond to demo request and qualify B2B fit | pre-contractual steps / legitimate interest | `DemoRequest`, email notification | DigitalOcean, Resend, Google Workspace | 12 months after last interaction unless converted or deletion requested | replace generic operator text before launch |
| Account registration | email, name, password hash, refresh tokens, memberships | user/admin | create and secure account | contract / pre-contractual steps | `User`, `RefreshToken`, `Membership` | DigitalOcean | account lifetime + security retention | add account deletion/export SOP |
| Organization profile | organization name, slug, website, country, industry, language, timezone, business DNA | account owner/client | configure workspace and AI context | contract / legitimate interest | `Organization` | DigitalOcean | account lifetime; delete/export at termination | define offboarding process |
| Widget settings | widget title, color, position, token, allowed origins | client/admin | secure and customize public widget | contract / security legitimate interest | `Organization` widget fields | DigitalOcean | account lifetime; token rotation on incident | never expose token in support messages |
| Widget conversation | customer name, email, message content, website URL, visitor ID, conversation ID, origin, user agent metadata | website visitor | answer visitor, capture lead, route handoff | client controller basis; Autopilot One as processor | `ReceptionConversation`, `ReceptionMessage`, `WidgetEvent` | DigitalOcean, AI provider | 12 months by default unless client config differs | avoid sensitive data prompts; support deletion/export |
| Lead scoring | name, email, summary, score, status, owner notes, linked conversations | website visitor/prospect | qualify and prioritize follow-up | client controller basis / legitimate interest | `Lead` | DigitalOcean, AI provider | 12 months or client-defined | disclose AI-assisted scoring; human review for decisions |
| Tasks and notifications | task title, description, priority, due date, event payload | account operator/client | operational follow-up and handoff | contract / legitimate interest | `Task`, `Event`, dashboard/notifications | DigitalOcean, Resend if emailed | 12 months or linked object retention | avoid unnecessary personal data in task descriptions |
| Knowledge base | uploaded text/doc content, website content, file metadata | client/admin | provide company context to AI | contract | `KnowledgeSource`, `KnowledgeChunk` | DigitalOcean, AI provider at query time | account lifetime; delete at termination | client must avoid uploading unnecessary personal/sensitive data |
| Email notifications | demo details, handoff details, lead/task summaries | prospect/client/operator | notify operators and support follow-up | legitimate interest / contract | Resend logs, Google Workspace mailbox | Resend, Google Workspace | mailbox retention per policy; operational messages 12 months | avoid sending secrets/tokens by email |
| Billing / Stripe | customer identity, billing email, subscription ID, payment status, invoices | client payer | paid subscription and financial compliance | contract / legal obligation | billing fields + Stripe | Stripe, DigitalOcean | per fiscal/legal obligation | activate only after company/legal final |
| Security logs | IP-like metadata if present, user agent, errors, authentication events | users/visitors | security, debugging, abuse prevention | legitimate interest / legal obligation | app logs, hosting logs | DigitalOcean, GitHub Actions where applicable | 30–90 days where feasible | document actual log retention on VPS |
| Support email | sender email, support content, attachments | prospect/client/user | support and issue handling | contract / legitimate interest | Google Workspace | Google Workspace | 12–24 months depending ticket relevance | create deletion/export workflow |

---

## 6. Processor and subprocessor register

| Provider | Role | Data categories | Region / transfer note | Contract/DPA status | Pre-launch action |
| --- | --- | --- | --- | --- | --- |
| DigitalOcean | hosting, VPS, database, infrastructure | application data, DB records, logs | confirm selected region and transfer terms | needs final DPA record | document region and backup retention |
| Google Workspace | business inbox | inbound/outbound emails, support/demo communications | Google terms and transfer mechanism to confirm | needs final DPA record | keep official inbox `contact@autopilot-one.com` |
| Resend | transactional email | demo notifications, future operational emails | confirm EU/US processing details | needs final DPA record | approved for demo email; no secrets in payload |
| OpenAI / configured AI provider | AI response generation | chat messages, selected context, conversation metadata | confirm provider terms, region/transfer, retention settings | needs final DPA/security review | disclose AI assistance; keep human handoff |
| Stripe | payments and subscriptions | billing identity, payment status, invoices | Stripe terms and transfer mechanism | final before live billing | do not enable paid self-serve until ready |
| GitHub | source code and CI metadata | code, issue/PR content, deploy metadata; no production secrets in repo | GitHub terms | acceptable for code; not customer data store | keep secrets out of repo and issues |

Do not add analytics, retargeting, pixel tracking, session replay, or marketing automation processors before a tracking/cookie decision is made.

---

## 7. Retention policy proposal

Default retention until legal review:

| Data type | Default retention | Deletion trigger | Notes |
| --- | --- | --- | --- |
| Demo requests | 12 months after last contact | deletion request / stale cleanup | extend if converted to customer record |
| Widget conversations | 12 months | client deletion request / workspace deletion | client-specific setting later |
| Leads | 12 months after last activity | deletion request / client cleanup | linked conversations must be handled together |
| Tasks/events | same as linked object | linked object cleanup | avoid orphaned test data |
| Account data | account lifetime | termination/deletion request | preserve minimal security/audit where needed |
| Refresh tokens | until expiration/revocation | logout/security rotation | already tokenized/hash storage |
| Knowledge sources | account lifetime | source deletion/workspace termination | delete chunks with source |
| Billing records | legal/fiscal retention | legal schedule | confirm with accountant/lawyer |
| Security logs | 30–90 days target | log rotation | document actual VPS setup |
| Support email | 12–24 months | request/cleanup | preserve active contractual disputes if needed |

Test data must be removed after QA unless intentionally kept as fixture data.

---

## 8. Data subject request SOP

Official intake channel before launch:

- `contact@autopilot-one.com`

Supported request types:

1. Access.
2. Rectification.
3. Erasure.
4. Export/portability where applicable.
5. Restriction.
6. Objection.
7. Withdrawal of consent where consent is used.

### 8.1 Intake checklist

For each request:

1. Record request date/time.
2. Verify requester identity proportionately.
3. Identify role: Autopilot One prospect/user, client admin, or client website visitor.
4. Determine whether Autopilot One is controller or processor for the data.
5. If processor, route to the client controller unless the DPA permits direct handling.
6. Search relevant systems.
7. Export, correct, restrict, or delete data as approved.
8. Confirm completion to requester.
9. Store minimal audit trail of the request.

### 8.2 System search checklist

Search by email, name, organization slug, and conversation ID where available:

- `DemoRequest`
- `User`
- `Membership`
- `Organization`
- `ReceptionConversation`
- `ReceptionMessage`
- `Lead`
- `Task`
- `Event`
- `WidgetEvent`
- Google Workspace mailbox
- Resend logs, if available
- Stripe records, if billing is active

### 8.3 Deletion order for widget data

For targeted widget cleanup:

1. `WidgetEvent`
2. `Event`
3. `Task`
4. `ReceptionConversation` — cascades `ReceptionMessage`
5. `Lead` if orphaned and not needed for another valid purpose

This order was validated during the AI smoke test cleanup.

---

## 9. Breach and incident SOP

Incident examples:

- exposed widget token;
- leaked API key;
- unauthorized account access;
- database exposure;
- email misdelivery with personal data;
- accidental public exposure of conversation content.

Initial response:

1. Contain: rotate token/key, disable access, revoke sessions, patch route.
2. Preserve evidence: timestamp, logs, affected tables, screenshots where appropriate.
3. Assess affected data categories and number of subjects.
4. Assess risk to individuals.
5. Notify the appropriate controller/client where Autopilot One is processor.
6. Decide whether supervisory authority / affected individual notification is required.
7. Document root cause and corrective action.

Operational target: complete initial assessment within 24 hours and prepare formal decision within 72 hours where required.

---

## 10. AI-specific safeguards

Current AI posture:

- AI can answer visitor messages through the public widget.
- AI can produce low-confidence responses.
- Low-confidence or high-score lead scenarios trigger human handoff / notifications.
- The system stores customer messages and AI replies.
- Lead scoring is AI-assisted and must be treated as support for human follow-up, not a fully automated legal or similarly significant decision.

Required safeguards:

1. Do not invite users to submit special category data.
2. Do not ask for unnecessary personal data in the widget.
3. Explain that AI may be used to draft or assist replies.
4. Preserve human handoff for uncertain, sensitive, or high-value interactions.
5. Keep AI prompts free from API keys, secrets, tokens, and internal credentials.
6. Do not use customer conversations for AI model training unless explicitly approved, contracted, and disclosed.
7. Add client onboarding note: client is responsible for informing its own website visitors when using the widget.

Public positioning should say: AI-assisted reception and lead routing, with human review available. Avoid: guaranteed sales, guaranteed accuracy, autonomous legal/financial/medical decisions.

---

## 11. Security operating controls

Baseline controls before controlled demos:

- Use HTTPS on public app and API.
- Keep secrets only in VPS/environment variables, not repository files.
- Use strong widget tokens and allowed origins.
- Rotate widget token after exposure or client change.
- Keep admin account access limited.
- Store password hashes, not plaintext passwords.
- Keep database access limited to VPS/operator.
- Run post-deploy QA and API health checks.
- Remove test data after QA.
- Avoid sending secrets through support chat or email.

Open security documentation items:

- actual VPS backup policy;
- database backup encryption and retention;
- log retention and rotation;
- admin access inventory;
- incident contact chain;
- subprocessors and DPA records.

---

## 12. DPA outline for B2B clients

A final DPA should cover:

1. Parties and roles.
2. Subject matter and duration.
3. Nature and purpose of processing.
4. Categories of personal data.
5. Categories of data subjects.
6. Client instructions.
7. Confidentiality.
8. Security measures.
9. Subprocessors and update mechanism.
10. International transfers.
11. Assistance with data subject requests.
12. Assistance with security incidents.
13. Deletion/export at termination.
14. Audit and compliance evidence.
15. Liability and order of precedence with the main agreement.

Suggested role language to review legally:

- Client is controller for personal data collected from its website visitors through the widget.
- Autopilot One processes that data on behalf of the client to provide AI reception, lead capture, inbox, handoff, and related operational features.
- Autopilot One may act as independent controller for account administration, billing, security, and its own prospect communications.

---

## 13. Public legal page impact

No public legal page should be finalized in this build.

Future public page updates need:

- final company/operator identity;
- contact details;
- processor list;
- retention summary;
- AI disclosure;
- user rights process;
- cookie/tracking status;
- Stripe/billing wording;
- DPA availability statement for B2B customers.

Until then, keep controlled demo language and avoid claiming full legal finality.

---

## 14. Operational checklist before first controlled client demo

Required before the first real client demo:

- [ ] Confirm official operator/company identity internally.
- [ ] Confirm primary privacy contact: `contact@autopilot-one.com`.
- [ ] Confirm no analytics/tracking pixels are active.
- [ ] Confirm demo request email flow works.
- [ ] Confirm AI widget flow works.
- [ ] Confirm test data cleanup procedure works.
- [ ] Confirm client will be manually onboarded.
- [ ] Confirm no payment collection is enabled before Stripe/legal final.
- [ ] Prepare short client-facing AI/GDPR explanation.
- [ ] Prepare DPA draft for legal review.

---

## 15. Acceptance criteria for Build #086A

Build #086A is complete when:

- this document exists in `docs/build-086a-gdpr-operating-pack.md`;
- data flows are mapped;
- likely roles are documented;
- processors are listed;
- retention proposals exist;
- DSR SOP exists;
- breach SOP exists;
- AI safeguards are documented;
- DPA outline exists;
- public-page blockers are explicit;
- no runtime code or public legal page is changed.

Build #086A does not mean GDPR is legally final. It means the internal operating structure is ready for review and controlled demo use.

---

## 16. Next recommended builds

1. **Build #087A — SEO schema + Search Console checklist**
   - add structured data plan;
   - prepare Search Console verification steps;
   - define sitemap submission checklist;
   - keep no tracking unless approved.

2. **Build #088A — Legal public pages finalization**
   - only after company/operator details are inserted;
   - update Privacy/Terms/Cookies;
   - add DPA availability note.

3. **Build #089A — Stripe live readiness**
   - verify company data;
   - configure live price IDs;
   - confirm webhook security;
   - keep activation gated until final approval.
