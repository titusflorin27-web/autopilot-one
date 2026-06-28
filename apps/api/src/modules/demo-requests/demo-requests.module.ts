import { Module } from "@nestjs/common";
import { PrismaModule } from "../../common/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { DemoRequestsController } from "./demo-requests.controller";
import { DemoRequestEmailService } from "./demo-request-email.service";
import { DemoRequestsService } from "./demo-requests.service";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [DemoRequestsController],
  providers: [DemoRequestsService, DemoRequestEmailService],
})
export class DemoRequestsModule {
}
