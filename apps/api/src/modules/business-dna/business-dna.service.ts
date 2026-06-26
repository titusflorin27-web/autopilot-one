import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { BusinessDna } from "@autopilot/shared";
import { PrismaService } from "../../common/prisma.service";
import { normalizeBusinessDna, UpdateBusinessDnaDto } from "./dto/update-business-dna.dto";

@Injectable()
export class BusinessDnaService {
  constructor(private readonly prisma: PrismaService) {}

  async findByOrganization(organizationId: string) {
    const organization = await this.prisma.organization.findUnique({
      where: { id: organizationId },
      select: {
        id: true,
        name: true,
        slug: true,
        businessDna: true,
        updatedAt: true,
      },
    });

    if (!organization) {
      throw new NotFoundException("Organization not found");
    }

    return {
      organizationId: organization.id,
      organizationName: organization.name,
      organizationSlug: organization.slug,
      businessDna: organization.businessDna as BusinessDna | null,
      updatedAt: organization.updatedAt,
    };
  }

  update(dto: UpdateBusinessDnaDto) {
    const businessDna = normalizeBusinessDna(dto.businessDna);

    return this.prisma.organization.update({
      where: { id: dto.organizationId },
      data: { businessDna: businessDna as unknown as Prisma.InputJsonValue },
      select: {
        id: true,
        name: true,
        slug: true,
        businessDna: true,
        updatedAt: true,
      },
    });
  }
}
