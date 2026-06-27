import { Controller, Get } from "@nestjs/common";

@Controller("health")
export class HealthController {
  @Get()
  getHealth() {
    return {
      status: "ok",
      service: "autopilot-api",
      version: "0.18.0",
      uptimeSeconds: Math.round(process.uptime()),
      timestamp: new Date().toISOString(),
    };
  }
}
