import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma.service";
import { CreateEventDto } from "./dto/create-event.dto";

@Injectable()
export class EventsService {
  constructor(private readonly prisma: PrismaService) {}

  create(dto: CreateEventDto) {
    return this.prisma.event.create({
      data: {
        organizationId: dto.organizationId,
        type: dto.type,
        payload: dto.payload as Prisma.InputJsonValue,
      },
    });
  }

  findByOrganization(organizationId: string) {
    return this.prisma.event.findMany({
      where: { organizationId },
      orderBy: { createdAt: "desc" },
    });
  }
}
