import { BadRequestException, Controller, Headers, HttpCode, Post, Req } from "@nestjs/common";
import type { Request } from "express";
import { BillingService } from "./billing.service";

type StripeWebhookRequest = Request & { rawBody?: Buffer };

@Controller("billing/stripe")
export class StripeWebhookController {
  constructor(private readonly billing: BillingService) {}

  @Post("webhook")
  @HttpCode(200)
  handleStripeWebhook(@Req() request: StripeWebhookRequest, @Headers("stripe-signature") stripeSignature?: string | string[]) {
    const signature = Array.isArray(stripeSignature) ? stripeSignature[0] : stripeSignature;

    if (!signature) {
      throw new BadRequestException("Missing Stripe signature");
    }

    if (!request.rawBody) {
      throw new BadRequestException("Missing raw webhook body");
    }

    return this.billing.handleStripeWebhook(request.rawBody, signature);
  }
}
