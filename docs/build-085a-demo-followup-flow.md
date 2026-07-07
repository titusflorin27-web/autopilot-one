# Build 085A - Demo Request Follow-Up Operating Flow

## Purpose

Make every public demo request actionable immediately after submission.

## Problem

The public demo form already created a database record and the private demo requests inbox already supported CRM fields. However, a new request could arrive without a default next step, internal note or follow-up date.

That creates operational ambiguity during outreach.

## Solution

When a public demo request is created, the API now automatically sets:

- an internal note that marks the record as a public demo request;
- a default next step to contact the lead within 24 hours;
- a follow-up timestamp 24 hours after creation.

The internal notification email now also includes:

- follow-up timestamp;
- recommended next step;
- internal note;
- link to the demo requests inbox.

## Operating flow

1. Visitor submits `/demo` form.
2. API creates `DemoRequest` with status `NEW`.
3. API fills CRM Lite defaults:
   - `internalNote`;
   - `nextStep`;
   - `followUpAt`.
4. If email notification env vars are configured, the internal notification is sent.
5. Owner opens `/demo-requests`.
6. Owner contacts the lead within 24 hours.
7. Owner updates status:
   - `CONTACTED`;
   - `QUALIFIED`;
   - `CLOSED`.
8. Owner edits CRM note, next step and follow-up date as needed.

## Environment variables for email notifications

Email notifications are optional and depend on Resend configuration:

- `RESEND_API_KEY`
- `DEMO_REQUEST_NOTIFICATION_TO`
- `DEMO_REQUEST_NOTIFICATION_FROM`
- `PUBLIC_APP_URL`

Do not commit real secret values to the repository.

## QA after deploy

Recommended manual QA:

1. Submit a demo request from `/demo`.
2. Log in to the app.
3. Open `/demo-requests`.
4. Confirm the request exists.
5. Confirm the request has:
   - status `NEW`;
   - internal note;
   - next step;
   - follow-up date.
6. Mark it as `CONTACTED`.
7. Save a custom CRM note and follow-up date.

## Current launch relevance

This build supports controlled pre-client demos. It does not activate Stripe and does not depend on final company details.
