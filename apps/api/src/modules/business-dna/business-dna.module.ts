import { Module } from "@nestjs/common";
import { PrismaModule } from "../../common/prisma.module";
import { AuthModule } from "../auth/auth.module";
import { BusinessDnaController } from "./business-dna.controller";
import { BusinessDnaService } from "./business-dna.service";

@Module({
  imports: [AuthModule, PrismaModule],
  controllers: [BusinessDnaController],
  providers: [BusinessDnaService],
})
export class BusinessDnaModule {}
