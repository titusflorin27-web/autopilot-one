import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { CreateOrganizationDto } from "./dto/create-organization.dto";

@Injectable()
export class OrganizationsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateOrganizationDto) {
    return this.prisma.organization.create({
      data: {
        name: dto.name,
        slug: dto.slug,
        industry: dto.industry,
        website: dto.website,
        country: dto.country,
        language: dto.language ?? "en",
        timezone: dto.timezone ?? "UTC",
      },
    });
  }

  findAll() {
    return this.prisma.organization.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  findById(id: string) {
    return this.prisma.organization.findUnique({
      where: { id },
    });
  }
}
