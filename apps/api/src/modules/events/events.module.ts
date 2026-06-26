import { Module } from "@nestjs/common";
import { PrismaModule } from "../../common/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { EventsController } from "./events.controller";
import { EventsService } from "./events.service";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [EventsController],
  providers: [EventsService],
})
export class EventsModule {}
