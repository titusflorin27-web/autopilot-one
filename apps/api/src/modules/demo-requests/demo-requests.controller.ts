import { Body, Controller, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { JwtAuthGuard } from "../auth/guards/jwt-auth.guard";
import { CreateDemoRequestDto } from "./dto/create-demo-request.dto";
import { UpdateDemoRequestStatusDto } from "./dto/update-demo-request-status.dto";
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

  @Patch(":id/status")
  @UseGuards(JwtAuthGuard)
  updateStatus(@Param("id") id: string, @Body() dto: UpdateDemoRequestStatusDto) {
    return this.demoRequests.updateStatus(id, dto.status);
  }
}
