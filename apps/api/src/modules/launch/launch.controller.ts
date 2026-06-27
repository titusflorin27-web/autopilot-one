import { Controller, Get, Param, UseGuards } from "@nestjs/common";
import { MembershipRole } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { LaunchService } from "./launch.service";

@Controller("launch")
@UseGuards(JwtAuthGuard, RolesGuard)
export class LaunchController {
  constructor(private readonly launch: LaunchService) {}

  @Get("organization/:organizationId/checklist")
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER)
  getChecklist(@Param("organizationId") organizationId: string) {
    return this.launch.getChecklist(organizationId);
  }
}
