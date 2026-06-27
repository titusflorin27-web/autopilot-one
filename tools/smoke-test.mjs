import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";

function file(path) {
  assert.equal(existsSync(path), true, `${path} must exist`);
  return readFileSync(path, "utf8");
}

const pkg = JSON.parse(file("package.json"));
assert.ok(pkg.scripts.build);
assert.ok(pkg.scripts.typecheck);
assert.ok(pkg.scripts["db:generate"]);
assert.ok(pkg.scripts["smoke:test"]);

assert.match(file(".github/workflows/ci.yml"), /pnpm smoke:test/);
assert.match(file("apps/api/src/main.ts"), /enableCors/);
assert.match(file("apps/api/src/main.ts"), /ValidationPipe/);
assert.match(file("apps/api/prisma/schema.prisma"), /model Organization/);
assert.match(file("apps/api/prisma/schema.prisma"), /model ReceptionConversation/);
assert.match(file("apps/api/prisma/schema.prisma"), /model WidgetEvent/);
assert.match(file("apps/api/prisma/schema.prisma"), /enum BillingPlan/);

file("apps/api/src/modules/health/health.controller.ts");
file("apps/api/src/modules/reception-ai/public-reception.controller.ts");
file("apps/api/src/modules/inbox/inbox.controller.ts");
file("apps/api/src/modules/notifications/notifications.controller.ts");
file("apps/api/src/modules/billing/billing.controller.ts");
file("apps/api/src/modules/launch/launch.controller.ts");
file("apps/web/src/app/launch/page.tsx");
file("apps/web/src/app/inbox/page.tsx");
file("apps/web/src/app/notifications/page.tsx");
file("apps/web/src/app/billing/page.tsx");
file("apps/api/Dockerfile");
file("apps/web/Dockerfile");
file("infrastructure/docker-compose.production.example.yml");
file("docs/release-candidate.md");
file("docs/mvp-walkthrough.md");
assert.match(file("docs/vps-docker-runbook.md"), /Rollback procedure/);

console.log("Smoke test passed.");
