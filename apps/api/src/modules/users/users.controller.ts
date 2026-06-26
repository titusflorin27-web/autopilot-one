import { Controller, Get } from "@nestjs/common";

@Controller("users")
export class UsersController {
  @Get("me")
  getMe() {
    return {
      id: "local-dev-user",
      email: "founder@autopilot.one",
      role: "owner",
    };
  }
}
