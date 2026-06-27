# Autopilot One Release Candidate

Status: Release Candidate after BUILD #020.

## MVP scope

Autopilot One now includes the minimum end-to-end product flow for a real pilot:

1. Account registration and login
2. Organization workspace
3. Business DNA setup
4. Knowledge Base setup
5. Reception AI
6. Public website widget
7. Widget settings and runtime controls
8. Widget analytics
9. Unified Inbox
10. Notifications
11. Plans and usage
12. Launch checklist
13. Production readiness checklist

## Release candidate criteria

The MVP can be considered release-candidate ready when all checks below pass in a clean environment.

### Build checks

- `pnpm install --frozen-lockfile=false`
- `pnpm db:generate`
- `pnpm typecheck`
- `pnpm build`

### Runtime checks

- API starts successfully.
- Web app starts successfully.
- `GET /api/health` returns `status: ok`.
- User can register.
- User can log in.
- Dashboard loads with authenticated session.

### Product checks

- Business DNA can be saved.
- Knowledge source can be added.
- Reception AI can answer a message.
- Widget settings can be viewed.
- Widget config endpoint returns browser-safe config.
- Public widget message creates a conversation.
- Inbox shows the conversation.
- Human reply can be added.
- Notifications page loads.
- Billing page loads usage and limits.
- Launch Checklist shows progress.

## Pilot readiness

Before inviting a pilot customer:

- Set production env values.
- Set exact CORS origins.
- Configure public widget allowed origins.
- Configure widget token per organization.
- Add at least one Knowledge Base source.
- Complete Business DNA.
- Run one full public widget message test.
- Verify Inbox and Notifications.
- Verify Launch Checklist progress.

## Known limitations

These are intentionally out of scope for the first release candidate:

- External checkout integration
- Persistent read/unread notifications
- Per-user notification preferences
- Distributed rate limiting
- Structured external logging
- Automated browser smoke tests
- Multi-tenant admin console

## Next decision

After BUILD #020, choose one path:

1. Deploy and run a private pilot.
2. Add deployment templates for a specific platform.
3. Add automated smoke tests before pilot.
