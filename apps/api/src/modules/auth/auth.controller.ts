import { Body, Controller, Post } from "@nestjs/common";
import { RateLimit } from "../../common/security/rate-limit.decorator";
import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post("register")
  @RateLimit({ name: "auth-register", limit: 5, windowSeconds: 300 })
  register(@Body() dto: RegisterDto) {
    return this.auth.register(dto);
  }

  @Post("login")
  @RateLimit({ name: "auth-login", limit: 10, windowSeconds: 60 })
  login(@Body() dto: LoginDto) {
    return this.auth.login(dto);
  }

  @Post("refresh")
  @RateLimit({ name: "auth-refresh", limit: 30, windowSeconds: 60 })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.auth.refresh(dto);
  }

  @Post("logout")
  logout(@Body() dto: RefreshTokenDto) {
    return this.auth.logout(dto);
  }
}
