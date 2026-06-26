import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { MembershipRole } from "@prisma/client";
import { PrismaService } from "../../../common/prisma.service";
import { ROLES_KEY } from "../decorators/roles.decorator";
import { AuthenticatedRequest } from "../types/auth-user";

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<MembershipRole[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles?.length) {
      return true;
    }

    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const organizationId = this.getOrganizationId(request);

    if (!request.user?.id || !organizationId) {
      throw new ForbiddenException("Organization membership is required");
    }

    const membership = await this.prisma.membership.findUnique({
      where: {
        userId_organizationId: {
          userId: request.user.id,
          organizationId,
        },
      },
    });

    if (!membership || !requiredRoles.includes(membership.role)) {
      throw new ForbiddenException("Insufficient organization permissions");
    }

    return true;
  }

  private getOrganizationId(request: AuthenticatedRequest): string | undefined {
    const params = request.params as Record<string, string | undefined>;
    const query = request.query as Record<string, string | undefined>;
    const body = request.body as Record<string, string | undefined> | undefined;

    return (
      params.organizationId ??
      params.id ??
      body?.organizationId ??
      query.organizationId
    );
  }
}
