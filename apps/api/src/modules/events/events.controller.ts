import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import { CreateEventDto } from "./dto/create-event.dto";
import { EventsService } from "./events.service";

@Controller("events")
export class EventsController {
  constructor(private readonly events: EventsService) {}

  @Post()
  create(@Body() dto: CreateEventDto) {
    return this.events.create(dto);
  }

  @Get("organization/:organizationId")
  findByOrganization(@Param("organizationId") organizationId: string) {
    return this.events.findByOrganization(organizationId);
  }
}
