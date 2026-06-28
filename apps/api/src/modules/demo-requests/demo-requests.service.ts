import { Injectable } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { CreateDemoRequestDto } from "./dto/create-demo-request.dto";

function cleanOptional(value?: string) {
  const cleaned = value?.trim();
  return cleaned || undefined;
}

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
      select: {
        id: true,
        name: true,
        email: true,
        company: true,
        phone: true,
        website: true,
        message: true,
        source: true,
        status: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }
}
