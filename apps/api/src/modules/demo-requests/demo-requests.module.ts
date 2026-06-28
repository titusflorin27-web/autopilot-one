import { Module } from "@nestjs/common";
import { PrismaModule } from "../../common/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { DemoRequestsController } from "./demo-requests.controller";
import { DemoRequestsService } from "./demo-requests.service";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [DemoRequestsController],
  providers: [DemoRequestsService],
})
export class DemoRequestsModule {
}
