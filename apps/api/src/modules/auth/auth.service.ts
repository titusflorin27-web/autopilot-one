import { ConflictException, Injectable, UnauthorizedException } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt";
import { MembershipRole, Prisma, User } from "@prisma/client";
import * as bcrypt from "bcrypt";
import { createHash, randomBytes } from "crypto";
import { PrismaService } from "../../common/prisma.service";
import { LoginDto } from "./dto/login.dto";
import { RefreshTokenDto } from "./dto/refresh-token.dto";
import { RegisterDto } from "./dto/register.dto";
import { AccessTokenPayload } from "./types/auth-user";

const PASSWORD_SALT_ROUNDS = 12;

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const email = dto.email.trim().toLowerCase();
    const organizationSlug = this.slugify(dto.organizationSlug ?? dto.organizationName);
    const passwordHash = await bcrypt.hash(dto.password, PASSWORD_SALT_ROUNDS);

    try {
      return await this.prisma.$transaction(async (tx) => {
        const user = await tx.user.create({
          data: {
            email,
            passwordHash,
            firstName: this.cleanOptionalText(dto.firstName),
            lastName: this.cleanOptionalText(dto.lastName),
          },
        });

        const organization = await tx.organization.create({
          data: {
            name: dto.organizationName.trim(),
            slug: organizationSlug,
            country: this.cleanOptionalText(dto.country),
            language: this.cleanOptionalText(dto.language) ?? "en",
            timezone: this.cleanOptionalText(dto.timezone) ?? "UTC",
          },
        });

        const membership = await tx.membership.create({
          data: {
            userId: user.id,
            organizationId: organization.id,
            role: MembershipRole.OWNER,
          },
        });

        const tokens = await this.issueTokenPair(user, tx);

        return {
          user: this.serializeUser(user),
          organization,
          membership,
          ...tokens,
        };
      });
    } catch (error) {
      this.handleUniqueConstraint(error);
      throw error;
    }
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { email: dto.email.trim().toLowerCase() },
      include: {
        memberships: {
          include: {
            organization: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    if (!user) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const passwordMatches = await bcrypt.compare(dto.password, user.passwordHash).catch(() => false);

    if (!passwordMatches) {
      throw new UnauthorizedException("Invalid email or password");
    }

    const tokens = await this.issueTokenPair(user);

    return {
      user: this.serializeUser(user),
      ...tokens,
    };
  }

  async refresh(dto: RefreshTokenDto) {
    const tokenHash = this.hashRefreshToken(dto.refreshToken);
    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true },
    });

    if (!storedToken || storedToken.revokedAt || storedToken.expiresAt <= new Date()) {
      throw new UnauthorizedException("Invalid or expired refresh token");
    }

    return this.prisma.$transaction(async (tx) => {
      await tx.refreshToken.update({
        where: { id: storedToken.id },
        data: { revokedAt: new Date() },
      });

      return this.issueTokenPair(storedToken.user, tx);
    });
  }

  async logout(dto: RefreshTokenDto) {
    await this.prisma.refreshToken.updateMany({
      where: {
        tokenHash: this.hashRefreshToken(dto.refreshToken),
        revokedAt: null,
      },
      data: { revokedAt: new Date() },
    });

    return { success: true };
  }

  private async issueTokenPair(user: Pick<User, "id" | "email">, client: Prisma.TransactionClient | PrismaService = this.prisma) {
    const payload: AccessTokenPayload = {
      sub: user.id,
      email: user.email,
    };

    const accessToken = await this.jwt.signAsync(payload, {
      secret: this.getAccessTokenSecret(),
      expiresIn: this.getAccessTokenTtl(),
    });

    const refreshToken = randomBytes(48).toString("base64url");
    const refreshTokenExpiresAt = this.getRefreshTokenExpiresAt();

    await client.refreshToken.create({
      data: {
        userId: user.id,
        tokenHash: this.hashRefreshToken(refreshToken),
        expiresAt: refreshTokenExpiresAt,
      },
    });

    return {
      tokenType: "Bearer",
      accessToken,
      refreshToken,
      accessTokenExpiresIn: this.getAccessTokenTtl(),
      refreshTokenExpiresAt,
    };
  }

  private serializeUser(user: User & { memberships?: Array<{ role: MembershipRole; organization: { id: string; name: string; slug: string } }> }) {
    return {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      memberships: user.memberships?.map((membership) => ({
        role: membership.role,
        organization: {
          id: membership.organization.id,
          name: membership.organization.name,
          slug: membership.organization.slug,
        },
      })) ?? [],
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  }

  private hashRefreshToken(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private getAccessTokenSecret(): string {
    const secret = this.config.get<string>("JWT_ACCESS_SECRET");

    if (!secret && this.config.get<string>("NODE_ENV") === "production") {
      throw new UnauthorizedException("JWT_ACCESS_SECRET is required in production");
    }

    return secret ?? "local-development-access-secret-change-me";
  }

  private getAccessTokenTtl(): string {
    return this.config.get<string>("JWT_ACCESS_TOKEN_TTL") ?? "15m";
  }

  private getRefreshTokenExpiresAt(): Date {
    const ttlDays = Number(this.config.get<string>("REFRESH_TOKEN_TTL_DAYS") ?? 30);
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + ttlDays);
    return expiresAt;
  }

  private cleanOptionalText(value?: string): string | undefined {
    const cleaned = value?.trim();
    return cleaned ? cleaned : undefined;
  }

  private slugify(value: string): string {
    const slug = value
      .trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    if (!slug) {
      throw new ConflictException("Organization slug could not be generated");
    }

    return slug;
  }

  private handleUniqueConstraint(error: unknown): void {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new ConflictException("Email or organization slug already exists");
    }
  }
}
