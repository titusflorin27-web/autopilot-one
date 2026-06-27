import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { MembershipRole, Prisma } from "@prisma/client";
import { randomBytes } from "crypto";
import { PrismaService } from "../../common/prisma.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";
import { UpdateWidgetSettingsDto } from "./dto/update-widget-settings.dto";

const DEFAULT_PUBLIC_WEB_URL = "https://app.autopilot-one.com";
const DEFAULT_PUBLIC_API_URL = "https://api.autopilot-one.com/api";

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateOrganizationDto, ownerUserId: string) {
    try {
      return await this.prisma.$transaction(async (tx) => {
        const organization = await tx.organization.create({
          data: {
            name: dto.name.trim(),
            slug: dto.slug.trim().toLowerCase(),
            industry: dto.industry,
            website: dto.website,
            country: dto.country,
            language: dto.language ?? "en",
            timezone: dto.timezone ?? "UTC",
            widgetTitle: `${dto.name.trim()} Reception AI`,
          },
        });

        const membership = await tx.membership.create({
          data: {
            userId: ownerUserId,
            organizationId: organization.id,
            role: MembershipRole.OWNER,
          },
        });

        return { organization, membership };
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new ConflictException("Organization slug already exists");
      }

      throw error;
    }
  }

  findAllForUser(userId: string) {
    return this.prisma.organization.findMany({
      where: {
        memberships: {
          some: { userId },
        },
      },
      include: {
        memberships: {
          where: { userId },
          select: { role: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async findByIdForUser(id: string, userId: string) {
    const organization = await this.prisma.organization.findFirst({
      where: {
        id,
        memberships: {
          some: { userId },
        },
      },
      include: {
        memberships: {
          where: { userId },
          select: { role: true },
        },
      },
    });

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    return organization;
  }

  async getWidgetSettings(organizationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: this.widgetSettingsSelect(),
    });

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    return {
      ...organization,
      publicConfigEndpoint: this.buildPublicConfigEndpoint(organization.slug),
      installSnippet: this.buildInstallSnippet(organization),
    };
  }

  async updateWidgetSettings(organizationId: string, dto: UpdateWidgetSettingsDto) {
    const organization = await this.prisma.organization.update({
      where: { id: organizationId },
      data: {
        widgetEnabled: dto.widgetEnabled,
        widgetTitle: dto.widgetTitle?.trim(),
        widgetPrimaryColor: dto.widgetPrimaryColor,
        widgetPosition: dto.widgetPosition,
        widgetToken: dto.widgetToken?.trim() || undefined,
        widgetAllowedOrigins: dto.widgetAllowedOrigins?.map((origin) => origin.trim()).filter(Boolean),
      },
      select: this.widgetSettingsSelect(),
    });

    await this.prisma.event.create({
      data: {
        organizationId,
        type: "widget.settings_updated",
        payload: {
          widgetEnabled: organization.widgetEnabled,
          widgetTitle: organization.widgetTitle,
          allowedOriginsCount: organization.widgetAllowedOrigins.length,
        } as Prisma.InputJsonValue,
      },
    });

    return {
      ...organization,
      publicConfigEndpoint: this.buildPublicConfigEndpoint(organization.slug),
      installSnippet: this.buildInstallSnippet(organization),
    };
  }

  async regenerateWidgetToken(organizationId: string) {
    const organization = await this.prisma.organization.update({
      where: { id: organizationId },
      data: { widgetToken: this.createWidgetToken() },
      select: this.widgetSettingsSelect(),
    });

    await this.prisma.event.create({
      data: {
        organizationId,
        type: "widget.token_regenerated",
        payload: { tokenRegenerated: true } as Prisma.InputJsonValue,
      },
    });

    return {
      ...organization,
      publicConfigEndpoint: this.buildPublicConfigEndpoint(organization.slug),
      installSnippet: this.buildInstallSnippet(organization),
    };
  }

  private widgetSettingsSelect() {
    return {
      id: true,
      name: true,
      slug: true,
      widgetEnabled: true,
      widgetTitle: true,
      widgetPrimaryColor: true,
      widgetPosition: true,
      widgetToken: true,
      widgetAllowedOrigins: true,
    } satisfies Prisma.OrganizationSelect;
  }

  private buildInstallSnippet(organization: {
    slug: string;
    widgetTitle: string;
    widgetToken: string | null;
  }) {
    const tokenLine = organization.widgetToken ? `\n  data-widget-token="${organization.widgetToken}"` : "";
    const publicWebUrl = this.getPublicWebUrl();
    const publicApiUrl = this.getPublicApiUrl();

    return `<script\n  src="${publicWebUrl}/autopilot-widget.js"\n  data-organization-slug="${organization.slug}"\n  data-api-url="${publicApiUrl}"\n  data-title="${organization.widgetTitle}"${tokenLine}\n  async\n></script>`;
  }

  private buildPublicConfigEndpoint(slug: string) {
    return `${this.getPublicApiUrl()}/public/reception-ai/widget/${slug}/config`;
  }

  private getPublicWebUrl() {
    return this.normalizeUrl(process.env.PUBLIC_APP_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? DEFAULT_PUBLIC_WEB_URL);
  }

  private getPublicApiUrl() {
    return this.normalizeUrl(process.env.PUBLIC_API_URL ?? process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_PUBLIC_API_URL);
  }

  private normalizeUrl(value: string) {
    return value.replace(/\/+$/, "");
  }

  private createWidgetToken() {
    return `widget_${randomBytes(24).toString("hex")}`;
  }
}
