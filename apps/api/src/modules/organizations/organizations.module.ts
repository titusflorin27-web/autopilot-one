import { Module } from "@nestjs/common";
import { PrismaModule } from "../../common/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { OrganizationsController } from "./organizations.controller";
import { OrganizationsService } from "./organizations.service";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [OrganizationsController],
  providers: [OrganizationsService],
  exports: [OrganizationsService],
})
export class OrganizationsModule {}
