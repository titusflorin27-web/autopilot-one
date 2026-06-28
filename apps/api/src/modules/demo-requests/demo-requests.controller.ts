import { Body, Controller, Get, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateDemoRequestDto } from "./dto/create-demo-request.dto";
import { DemoRequestsService } from "./demo-requests.service";

@Controller("demo-requests")
export class DemoRequestsController {
  constructor(private readonly demoRequests: DemoRequestsService) {}

  @Post()
  create(@Body() dto: CreateDemoRequestDto) {
    return this.demoRequests.create(dto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  list() {
    return this.demoRequests.list();
  }
}
