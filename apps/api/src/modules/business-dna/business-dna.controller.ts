import { Body, Controller, Put } from "@nestjs/common";
import { BusinessDnaService } from "./business-dna.service";
import { UpdateBusinessDnaDto } from "./dto/update-business-dna.dto";

@Controller("business-dna")
export class BusinessDnaController {
  constructor(private readonly businessDna: BusinessDnaService) {}

  @Put()
  update(@Body() dto: UpdateBusinessDnaDto) {
    return this.businessDna.update(dto);
  }
}
