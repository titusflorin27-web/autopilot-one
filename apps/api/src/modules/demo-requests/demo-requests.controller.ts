import { Body, Controller, Post } from "@nestjs/common";
import { CreateDemoRequestDto } from "./dto/create-demo-request.dto";
import { DemoRequestsService } from "./demo-requests.service";

@Controller("demo-requests")
export class DemoRequestsController {
  constructor(private readonly demoRequests: DemoRequestsService) {}

  @Post()
  create(@Body() dto: CreateDemoRequestDto) {
    return this.demoRequests.create(dto);
  }
}
