import { ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { MembershipRole, Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";

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
}
