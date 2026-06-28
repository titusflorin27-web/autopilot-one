import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./common/prisma.module";
import { AuthModule } from "./modules/auth/auth.module";
import { HealthModule } from "./modules/health/health.module";
import { OrganizationsModule } from "./modules/organizations/organizations.module";
import { UsersModule } from "./modules/users/users.module";
import { EventsModule } from "./modules/events/events.module";
import { BusinessDnaModule } from "./modules/business-dna/business-dna.module";
import { KnowledgeBaseModule } from "./modules/knowledge-base/knowledge-base.module";
import { ReceptionAiModule } from "./modules/reception-ai/reception-ai.module";
import { InboxModule } from "./modules/inbox/inbox.module";
import { NotificationsModule } from "./modules/notifications/notifications.module";
import { BillingModule } from "./modules/billing/billing.module";
import { LaunchModule } from "./modules/launch/launch.module";
import { DemoRequestsModule } from "./modules/demo-requests/demo-requests.module";
import { DashboardModule } from "./modules/dashboard/dashboard.module";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    HealthModule,
    OrganizationsModule,
    UsersModule,
    EventsModule,
    BusinessDnaModule,
    KnowledgeBaseModule,
    ReceptionAiModule,
    InboxModule,
    NotificationsModule,
    BillingModule,
    LaunchModule,
    DemoRequestsModule,
    DashboardModule,
  ],
})
export class AppModule {}
