# BUILD #078A — Functional Pilot QA

## Scope

This build adds a production-safe functional QA script and checklist for validating the first real Autopilot One pilot flow after the RO/EN launch stabilization work.

It does not add product features, database migrations or billing changes.

## Functional flow covered

The script validates the following pilot path:

1. Public web routes load.
2. API health is OK.
3. Public demo request endpoint accepts a test request.
4. A new pilot user can register.
5. The same user can log in.
6. The user can read organizations and widget settings.
7. A text knowledge source can be created and searched.
8. Reception AI can handle an internal customer message.
9. Conversations, leads, tasks, inbox and dashboard metrics are readable.
10. Billing overview is readable.

## Script

Run from the VPS after this branch lands on `main`:

```bash
cd /opt/autopilot-one
sh scripts/vps-functional-pilot-qa.sh
```

The script creates a unique QA user and organization using a timestamped email and slug. The data is intentionally left in the database as an auditable test run.

## Useful environment overrides

```bash
RUN_ID=manual-001 sh scripts/vps-functional-pilot-qa.sh
RUN_DEMO_REQUEST=0 sh scripts/vps-functional-pilot-qa.sh
RUN_RECEPTION_AI_MESSAGE=0 sh scripts/vps-functional-pilot-qa.sh
PILOT_EMAIL=test@example.com PILOT_ORG_SLUG=test-org sh scripts/vps-functional-pilot-qa.sh
```

Use `RUN_DEMO_REQUEST=0` if the public demo endpoint rate limit was already hit during repeated QA runs.

Use `RUN_RECEPTION_AI_MESSAGE=0` if the AI gateway should not be exercised in that run.

## Manual browser QA after script passes

### Romanian

- Open `/` and confirm the homepage shows the new hero and CTA set.
- Open `/pricing` and confirm Free, Starter, Pro and Business are visible.
- Open `/demo` and submit a real manual demo request if needed.
- Open `/login` and log in with the generated pilot account.
- Confirm the dashboard loads after login.
- Confirm Knowledge Base, Inbox, Widget settings and Billing pages render without old copy or mixed language.

### English

- Switch to EN from the language switcher.
- Confirm homepage, pricing, demo, login and register switch to English.
- Refresh and confirm EN preference persists.

## Pass criteria

- The script ends with `FUNCTIONAL PILOT QA PASSED`.
- Manual login works in browser.
- The test organization is visible in the dashboard.
- Knowledge source appears in the dashboard.
- The Reception AI test message creates a conversation and can be found in inbox/conversations.
- Billing overview renders and does not promise live checkout unless the provider is configured.

## Failure triage

- `demo-requests` 429: rerun with `RUN_DEMO_REQUEST=0` or wait for the rate limit window.
- `auth/register` 409: rerun with a fresh `RUN_ID` or unique `PILOT_EMAIL` and `PILOT_ORG_SLUG`.
- `reception-ai/message` slow or failing: inspect API logs and rerun with `RUN_RECEPTION_AI_MESSAGE=0` to isolate non-AI flows.
- authenticated endpoints 401/403: inspect JWT config and role guard behavior.
- dashboard or billing read failures: inspect route/controller mismatch before changing UI.
