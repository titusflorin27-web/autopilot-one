import { DemoRequestStatus } from "@prisma/client";
import { Injectable, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { CreateDemoRequestDto } from "./dto/create-demo-request.dto";
import { UpdateDemoRequestCrmDto } from "./dto/update-demo-request-crm.dto";

function cleanOptional(value?: string) {
  const cleaned = value?.trim();
  return cleaned || undefined;
}

function cleanNullable(value?: string | null) {
  const cleaned = value?.trim();
  return cleaned || null;
}

const demoRequestSelect = {
  id: true,
  name: true,
  email: true,
  company: true,
  phone: true,
  website: true,
  message: true,
  source: true,
  status: true,
  internalNote: true,
  nextStep: true,
  followUpAt: true,
  createdAt: true,
  updatedAt: true,
};

@Injectable()
export class DemoRequestsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(dto: CreateDemoRequestDto) {
    const demoRequest = await this.prisma.demoRequest.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.trim().toLowerCase(),
        company: cleanOptional(dto.company),
        phone: cleanOptional(dto.phone),
        website: cleanOptional(dto.website),
        message: dto.message.trim(),
        source: cleanOptional(dto.source) ?? "demo_page",
      },
      select: {
        id: true,
        status: true,
        createdAt: true,
      },
    });

    return {
      ok: true,
      demoRequest,
      message: "Cererea demo a fost primită.",
    };
  }

  list() {
    return this.prisma.demoRequest.findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      select: demoRequestSelect,
    });
  }

  async updateStatus(id: string, status: DemoRequestStatus) {
    try {
      return await this.prisma.demoRequest.update({
        where: { id },
        data: { status },
        select: demoRequestSelect,
      });
    } catch {
      throw new NotFoundException("Cererea demo nu a fost găsită.");
    }
  }

  async updateCrm(id: string, dto: UpdateDemoRequestCrmDto) {
    try {
      return await this.prisma.demoRequest.update({
        where: { id },
        data: {
          internalNote: cleanNullable(dto.internalNote),
          nextStep: cleanNullable(dto.nextStep),
          followUpAt: dto.followUpAt ? new Date(dto.followUpAt) : null,
        },
        select: demoRequestSelect,
      });
    } catch {
      throw new NotFoundException("Cererea demo nu a fost găsită.");
    }
  }
}
