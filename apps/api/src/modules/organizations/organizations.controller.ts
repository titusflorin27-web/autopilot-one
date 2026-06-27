import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { MembershipRole } from "@prisma/client";
import { CurrentUser } from "../auth/decorators/current-user.decorator";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { AuthUser } from "../auth/types/auth-user";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateWidgetSettingsDto } from "./dto/update-widget-settings.dto";
import { OrganizationsService } from "./organizations.service";

@Controller("organizations")
@UseGuards(JwtAuthGuard)
export class OrganizationsController {
  constructor(private readonly organizations: OrganizationsService) {}

  @Post()
  create(@Body() dto: CreateOrganizationDto, @CurrentUser() user: AuthUser) {
    return this.organizations.create(dto, user.id);
  }

  @Get()
  findAll(@CurrentUser() user: AuthUser) {
    return this.organizations.findAllForUser(user.id);
  }

  @Get(":id")
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER)
  findById(@Param("id") id: string, @CurrentUser() user: AuthUser) {
    return this.organizations.findByIdForUser(id, user.id);
  }

  @Get(":id/widget-settings")
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER)
  getWidgetSettings(@Param("id") id: string) {
    return this.organizations.getWidgetSettings(id);
  }

  @Patch(":id/widget-settings")
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  updateWidgetSettings(@Param("id") id: string, @Body() dto: UpdateWidgetSettingsDto) {
    return this.organizations.updateWidgetSettings(id, dto);
  }

  @Post(":id/widget-settings/token")
  @UseGuards(RolesGuard)
  @Roles(MembershipRole.OWNER, MembershipRole.ADMIN)
  regenerateWidgetToken(@Param("id") id: string) {
    return this.organizations.regenerateWidgetToken(id);
  }
}
