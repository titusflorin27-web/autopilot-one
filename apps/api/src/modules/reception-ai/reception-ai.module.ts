import { Module } from "@nestjs/common";
import { PrismaModule } from "../../common/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { ReceptionAiController } from "./reception-ai.controller";
import { ReceptionAiService } from "./reception-ai.service";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [ReceptionAiController],
  providers: [ReceptionAiService],
})
export class ReceptionAiModule {}
