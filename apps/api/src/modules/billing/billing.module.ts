import { Module } from "@nestjs/common";
import { PrismaModule } from "../../common/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { BillingController } from "./billing.controller";
import { BillingService } from "./billing.service";
import { StripeWebhookController } from "./stripe-webhook.controller";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [BillingController, StripeWebhookController],
  providers: [BillingService],
})
export class BillingModule {}
