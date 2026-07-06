# First Pilot Launch Readiness Checklist

Use this checklist after Build #078A has passed and before inviting the first real pilot customer.

## 1. Production baseline

- `scripts/vps-stabilized-deploy.sh` passes.
- `scripts/vps-ro-en-live-qa.sh` passes.
- `scripts/vps-functional-pilot-qa.sh` passes.
- Docker services are up: proxy, web, api, postgres, redis.
- API health returns `status: ok`.
- No post-warm-up fresh errors appear in proxy, web, api, postgres or redis logs.

## 2. Public website

### Romanian

- Homepage shows the new positioning and CTA set.
- Pricing shows Free, Starter, Pro and Business.
- Demo page copy is clear and the form submits.
- Privacy, cookies, terms, refund policy and consumer rights pages contain no placeholders.
- Login and register pages use Romanian hero copy.

### English

- Language switcher changes homepage, pricing, demo, login and register to English.
- Refresh preserves the EN preference.
- No visible Romanian copy remains on the English public path except brand/product names.

## 3. First pilot account

- Create a real pilot workspace with the customer email.
- Confirm login works in browser.
- Confirm dashboard loads after login.
- Confirm the organization name, slug and language are correct.
- Confirm the owner account is the intended customer/admin.

## 4. Knowledge Base

- Add at least one text source with the customer's core services.
- Add at least one FAQ-style source.
- Search for one service question and confirm results appear.
- Confirm sources display correctly in the dashboard.
- Avoid uploading sensitive or regulated content until the data-processing terms are reviewed.

## 5. Reception AI and Inbox

- Send one internal test message from the dashboard flow.
- Confirm a conversation is created.
- Confirm a lead is created when the message includes contact details.
- Confirm a task/follow-up appears when appropriate.
- Confirm the inbox shows the conversation with the customer message and AI reply.
- Confirm a human reply can be added if the UI supports it.

## 6. Widget

- Confirm widget settings load for the pilot organization.
- Confirm the widget title, color and position are acceptable.
- Confirm allowed origins are configured before production embed.
- Generate/copy the widget snippet only after allowed origins are correct.
- Test widget on the allowed domain or staging page.
- Confirm widget conversation appears in inbox and widget analytics.

## 7. Billing and commercial state

- Confirm the pilot plan is correct.
- Confirm billing overview renders.
- Confirm checkout buttons do not promise live payment unless Stripe/provider is configured.
- Confirm over-limit messaging is clear if limits are shown.
- Record the agreed pilot terms outside the app until billing automation is fully live.

## 8. Email and notifications

- Submit a real demo request from the public page.
- Confirm the request appears in the app.
- Confirm email notification delivery if SMTP/provider is configured.
- If email is not configured, document manual follow-up responsibility.

## 9. QA data cleanup

After QA is no longer needed, run a dry-run cleanup first:

```bash
RUN_ID=<qa-run-id> sh scripts/vps-qa-data-cleanup.sh
```

Then delete only after reviewing matched records:

```bash
RUN_ID=<qa-run-id> DRY_RUN=0 CONFIRM_DELETE_QA_DATA=1 sh scripts/vps-qa-data-cleanup.sh
```

For the Build #078A run from 2026-07-06, the QA values were:

```bash
RUN_ID=20260706184914
PILOT_EMAIL=pilot-qa-20260706184914@example.com
PILOT_ORG_SLUG=autopilot-qa-20260706184914
```

## 10. Go / no-go

Go only if:

- public site QA passes;
- functional pilot QA passes;
- first pilot login works manually;
- the widget is restricted to approved origins;
- legal pages have no placeholders;
- billing copy is accurate for the current payment state;
- support/follow-up owner is defined.

No-go if:

- registration or login fails;
- widget can be used from unapproved origins;
- dashboard or inbox cannot load;
- legal placeholders reappear;
- checkout/payment behavior is unclear or misleading;
- email follow-up ownership is undefined.
