import { BillingPlan } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateBillingPlanDto {
  @IsEnum(BillingPlan)
  plan!: BillingPlan;
}
