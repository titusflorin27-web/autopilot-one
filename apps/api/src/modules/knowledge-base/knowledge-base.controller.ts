import { Body, Controller, Get, Param, Post, UploadedFile, UseGuards, UseInterceptors } from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { MembershipRole } from "@prisma/client";
import { Roles } from "../auth/decorators/roles.decorator";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { RolesGuard } from "../auth/guards/roles.guard";
import { CreateTextSourceDto } from "./dto/create-text-source.dto";
import { CreateWebsiteSourceDto } from "./dto/create-website-source.dto";
import { SearchKnowledgeDto } from "./dto/search-knowledge.dto";
import { KnowledgeBaseService } from "./knowledge-base.service";

const MEMBER_ROLES = [MembershipRole.OWNER, MembershipRole.ADMIN, MembershipRole.MEMBER];
const EDITOR_ROLES = [MembershipRole.OWNER, MembershipRole.ADMIN];

@Controller("knowledge-base")
@UseGuards(JwtAuthGuard, RolesGuard)
export class KnowledgeBaseController {
  constructor(private readonly knowledgeBase: KnowledgeBaseService) {}

  @Get("organization/:organizationId/sources")
  @Roles(...MEMBER_ROLES)
  listSources(@Param("organizationId") organizationId: string) {
    return this.knowledgeBase.listSources(organizationId);
  }

  @Post("text")
  @Roles(...EDITOR_ROLES)
  createTextSource(@Body() dto: CreateTextSourceDto) {
    return this.knowledgeBase.createTextSource(dto);
  }

  @Post("website")
  @Roles(...EDITOR_ROLES)
  createWebsiteSource(@Body() dto: CreateWebsiteSourceDto) {
    return this.knowledgeBase.createWebsiteSource(dto);
  }

  @Post("upload")
  @Roles(...EDITOR_ROLES)
  @UseInterceptors(FileInterceptor("file"))
  uploadFile(
    @UploadedFile() file: { originalname?: string; mimetype?: string; buffer?: Buffer },
    @Body("organizationId") organizationId: string,
    @Body("title") title?: string,
  ) {
    return this.knowledgeBase.uploadFile(organizationId, title, file);
  }

  @Post("search")
  @Roles(...MEMBER_ROLES)
  search(@Body() dto: SearchKnowledgeDto) {
    return this.knowledgeBase.search(dto);
  }
}
