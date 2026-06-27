import { Module } from "@nestjs/common";
import { PrismaModule } from "../../common/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { LaunchController } from "./launch.controller";
import { LaunchService } from "./launch.service";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [LaunchController],
  providers: [LaunchService],
})
export class LaunchModule {}
