# BUILD #079A — Pilot Cleanup and Launch Readiness

## Scope

This build prepares Autopilot One for the first real pilot after the functional QA pass from Build #078A.

It adds operational safety tools and launch readiness documentation only.

## Changes

- Adds `scripts/vps-qa-data-cleanup.sh`.
  - Dry-run by default.
  - Requires explicit identifiers such as `RUN_ID`, `PILOT_EMAIL`, or `PILOT_ORG_SLUG`.
  - Requires `DRY_RUN=0 CONFIRM_DELETE_QA_DATA=1` before deleting anything.
  - Deletes the QA organization, QA user, related operational records and matching demo request records only after confirmation.
- Adds `docs/first-pilot-launch-readiness-checklist.md`.
  - Covers production baseline, public website, RO/EN, first pilot account, knowledge base, Reception AI, widget, billing, email/notifications, cleanup and go/no-go criteria.

## What this does not change

- No product feature changes.
- No database schema changes.
- No API endpoint changes.
- No billing provider changes.
- No public copy changes.

## Cleanup examples

Dry run for the latest Build #078A QA run:

```bash
RUN_ID=20260706184914 sh scripts/vps-qa-data-cleanup.sh
```

Delete only after reviewing the dry-run output:

```bash
RUN_ID=20260706184914 DRY_RUN=0 CONFIRM_DELETE_QA_DATA=1 sh scripts/vps-qa-data-cleanup.sh
```

Direct targeting is also supported:

```bash
PILOT_EMAIL=pilot-qa-20260706184914@example.com \
PILOT_ORG_SLUG=autopilot-qa-20260706184914 \
sh scripts/vps-qa-data-cleanup.sh
```

## First pilot recommendation

Before inviting the first real customer:

1. Run the stabilized deploy QA.
2. Run the functional pilot QA.
3. Open the generated pilot account manually in browser.
4. Confirm dashboard, knowledge base, inbox, widget settings and billing render correctly.
5. Configure allowed widget origins before embedding the widget on any customer domain.
6. Confirm who owns demo request follow-up and customer support during the pilot.

## Pass criteria

Build #079A is ready when:

- cleanup dry-run lists only expected QA data;
- launch readiness checklist is reviewed;
- no destructive cleanup is run without explicit confirmation;
- first pilot go/no-go criteria are understood.
