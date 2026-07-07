import { DemoRequestStatus } from "@prisma/client";
import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { PrismaService } from "../../common/prisma.service";
import { DemoRequestEmailService } from "./demo-request-email.service";
import { CreateDemoRequestDto } from "./dto/create-demo-request.dto";
import { UpdateDemoRequestCrmDto } from "./dto/update-demo-request-crm.dto";

const DEFAULT_FOLLOW_UP_DELAY_HOURS = 24;

function cleanOptional(value?: string) {
  const cleaned = value?.trim();
  return cleaned || undefined;
}

function cleanNullable(value?: string | null) {
  const cleaned = value?.trim();
  return cleaned || null;
}

function defaultFollowUpDate() {
  return new Date(Date.now() + DEFAULT_FOLLOW_UP_DELAY_HOURS * 60 * 60 * 1000);
}

function buildInitialNextStep(dto: CreateDemoRequestDto) {
  const contactMethod = cleanOptional(dto.phone) ? "telefon sau email" : "email";
  return `Contactează leadul prin ${contactMethod} în maximum 24h și confirmă primul caz de utilizare pentru demo.`;
}

function buildInitialInternalNote(dto: CreateDemoRequestDto) {
  const parts = [
    "Cerere demo publică. Verifică fit-ul B2B înainte de activare.",
    cleanOptional(dto.company) ? `Companie: ${cleanOptional(dto.company)}` : null,
    cleanOptional(dto.website) ? `Website: ${cleanOptional(dto.website)}` : null,
    cleanOptional(dto.source) ? `Sursă: ${cleanOptional(dto.source)}` : "Sursă: demo_page",
  ].filter(Boolean);

  return parts.join("\n");
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
  private readonly logger = new Logger(DemoRequestsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly emailNotifications: DemoRequestEmailService,
  ) {}

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
        internalNote: buildInitialInternalNote(dto),
        nextStep: buildInitialNextStep(dto),
        followUpAt: defaultFollowUpDate(),
      },
      select: demoRequestSelect,
    });

    void this.emailNotifications.sendNewDemoRequestNotification(demoRequest).catch((error) => {
      this.logger.error(`Demo request email notification failed for ${demoRequest.id}`, error instanceof Error ? error.stack : undefined);
    });

    return {
      ok: true,
      demoRequest: {
        id: demoRequest.id,
        status: demoRequest.status,
        createdAt: demoRequest.createdAt,
      },
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
