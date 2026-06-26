import { Module } from "@nestjs/common";
import { BusinessDnaController } from "./business-dna.controller";
import { BusinessDnaService } from "./business-dna.service";

@Module({
  controllers: [BusinessDnaController],
  providers: [BusinessDnaService],
})
export class BusinessDnaModule {}
