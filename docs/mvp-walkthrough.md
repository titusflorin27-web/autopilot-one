# MVP Walkthrough

This walkthrough demonstrates Autopilot One end-to-end.

## 1. Register

Open the web app and create a user account.

Expected result:

- user account is created
- organization workspace is created
- dashboard becomes available

## 2. Complete Business DNA

Open `/onboarding`.

Add:

- company summary
- services or products
- operating rules
- tone of voice
- FAQ
- objectives

Expected result:

- Business DNA is saved
- Reception AI has company context

## 3. Add Knowledge Base

Open `/knowledge-base`.

Add at least one source:

- text source
- website source
- uploaded document

Expected result:

- source is indexed
- search returns relevant chunks

## 4. Test Reception AI internally

Open `/reception-ai`.

Send a realistic customer question.

Expected result:

- AI response is generated
- confidence is shown
- citations may be shown
- lead/task may be created when intent is strong

## 5. Configure Website Widget

Open `/widget-settings`.

Check:

- widget enabled
- title
- color
- position
- token
- allowed origins
- install snippet

Expected result:

- snippet is ready to copy
- public config endpoint is visible

## 6. Test Website Widget

Open `/widget-demo` or install the snippet on a test page.

Send a customer-style message.

Expected result:

- public message reaches the API
- public conversation is created
- safe public response is returned
- widget analytics records activity

## 7. Review Widget Analytics

Open `/widget-analytics`.

Expected result:

- config load is visible
- widget load/open events are visible
- message events are visible
- domains are shown when available

## 8. Resolve Conversation in Inbox

Open `/inbox`.

Expected result:

- website conversation appears
- message timeline is visible
- lead context is visible when available
- human reply can be added
- conversation can be opened, handed off or closed

## 9. Check Notifications

Open `/notifications`.

Expected result:

- handoffs are visible
- high-score leads are visible
- high-priority tasks are visible
- email-ready payloads are visible

## 10. Check Plans and Usage

Open `/billing`.

Expected result:

- current plan is visible
- widget message usage is visible
- Knowledge Base usage is visible
- team member usage is visible
- limits and remaining quota are visible

## 11. Check Launch Checklist

Open `/launch`.

Expected result:

- launch progress is shown
- ready-for-pilot status is shown
- guided demo path links to remaining work

## 12. Production Readiness

Open `docs/production-readiness.md`.

Expected result:

- environment checklist is clear
- release steps are defined
- public widget production settings are listed
