import { Body, Controller, Get, Param, Post, UseGuards } from "@nestjs/common";
import { MembershipRole } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CreateEventDto } from "./dto/create-event.dto";
import { EventsService } from "./events.service";

const MEMBER_ROLES = [MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER];

@Controller("events")
@UseGuards(JwtAuthGuard, RolesGuard)
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Post()
  @Roles(...MEMBER_ROLES)
  create(@Body() dto: CreateEventDto) {
    return this.events.create(dto);
  }

  @Get("organization/:organizationId")
  @Roles(...MEMBER_ROLES)
  findByOrganization(@Param("organizationId") organizationId: string) {
    return this.events.findByOrganization(organizationId);
  }
}
