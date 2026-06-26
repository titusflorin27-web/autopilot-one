import { Body, Controller, Put, UseGuards } from "@nestjs/common";
import { MembershipRole } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { BusinessDnaService } from "./business-dna.service";
import { UpdateBusinessDnaDto } from "./dto/update-business-dna.dto";

@Controller("business-dna")
@UseGuards(JwtAuthGuard, RolesGuard)
export class BusinessDnaController {
  constructor(private readonly businessDna: BusinessDnaService) {}

  @Put()
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  update(@Body() dto: UpdateBusinessDnaDto) {
    return this.businessDna.update(dto);
  }
}
