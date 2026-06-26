import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: "ok",
      service: "autopilot-api",
      version: "0.2.0",
      timestamp: new Date().toISOString(),
    };
  }
}
