import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { AccessTokenPayload, AuthenticatedRequest } from "../types/auth-user";

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const token = this.extractBearerToken(request.headers.authorization);

    if (!token) {
      throw new UnauthorizedException("Missing bearer token");
    }

    try {
      const payload = await this.jwt.verifyAsync<AccessTokenPayload>(token, {
        secret: this.getAccessTokenSecret(),
      });

      request.user = {
        id: payload.sub,
        email: payload.email,
      };

      return true;
    } catch {
      throw new UnauthorizedException("Invalid or expired bearer token");
    }
  }

  private extractBearerToken(authorization?: string): string | null {
    if (!authorization) {
      return null;
    }

    const [type, token] = authorization.split(" ");
    return type === "Bearer" && token ? token : null;
  }

  private getAccessTokenSecret(): string {
    const secret = this.config.get<string>("JWT_ACCESS_SECRET");

    if (!secret && this.config.get<string>("NODE_ENV") === "production") {
      throw new UnauthorizedException("JWT access secret is not configured");
    }

    return secret ?? "local-development-access-secret-change-me";
  }
}
