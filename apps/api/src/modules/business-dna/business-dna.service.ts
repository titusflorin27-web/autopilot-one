import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../common/prisma.service";
import { UpdateBusinessDnaDto } from "./dto/update-business-dna.dto";

@Injectable()
export class BusinessDnaService {
  constructor(private readonly prisma: PrismaService) {}

  update(dto: UpdateBusinessDnaDto) {
    return this.prisma.organization.update({
      where: { id: dto.organizationId },
      data: { businessDna: dto.businessDna as Prisma.InputJsonValue },
    });
  }
}
