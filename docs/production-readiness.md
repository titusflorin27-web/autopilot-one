# Production Readiness Checklist

## Runtime

- Set `NODE_ENV=production`.
- Set `API_PORT` to the platform port.
- Set `API_CORS_ORIGINS` to the exact web app origins.
- Use separate production database and Redis instances.
- Run Prisma migrations before serving traffic.

## API secrets

- Set a long random `JWT_ACCESS_SECRET`.
- Rotate secrets before public launch.
- Keep local `.env` files out of source control.

## Web app

- Set `NEXT_PUBLIC_API_URL` to the public API URL including `/api`.
- Set `NEXT_PUBLIC_APP_URL` to the public web URL.

## AI Gateway

- Keep Reception AI in fallback mode until provider keys are configured.
- Set `AI_GATEWAY_MODEL` explicitly.
- Monitor fallback usage before customer launch.

## Public widget

- Configure `PUBLIC_WIDGET_ALLOWED_ORIGINS` for production domains.
- Use per-organization widget tokens where possible.
- Keep rate limits conservative for public traffic.
- Verify `/widget-analytics` after installing the widget.

## Observability

- Monitor `GET /api/health`.
- Watch request logs for non-2xx spikes.
- Watch widget analytics for load/open/error trends.
- Review notifications and inbox daily during pilots.

## Release steps

1. Merge the build PR.
2. Pull latest `main` on deployment branch.
3. Set production env values.
4. Run install.
5. Run database migration.
6. Run build.
7. Start API and web processes.
8. Verify `/api/health`.
9. Verify login.
10. Verify widget config and public message flow.
