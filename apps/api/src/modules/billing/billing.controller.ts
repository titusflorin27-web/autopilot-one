import { Body, Controller, Get, Param, Patch, UseGuards } from "@nestjs/common";
import { MembershipRole } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { BillingService } from "./billing.service";
import { UpdateBillingPlanDto } from "./dto/update-billing-plan.dto";

@Controller("billing")
@UseGuards(JwtAuthGuard, RolesGuard)
export class BillingController {
  constructor(private readonly billing: BillingService) {}

  @Get("organization/:organizationId")
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER)
  getBillingOverview(@Param("organizationId") organizationId: string) {
    return this.billing.getBillingOverview(organizationId);
  }

  @Patch("organization/:organizationId/plan")
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  updatePlan(@Param("organizationId") organizationId: string, @Body() dto: UpdateBillingPlanDto) {
    return this.billing.updatePlan(organizationId, dto.plan);
  }
}
