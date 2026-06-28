import { CanActivate, ExecutionContext, HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Request, Response } from "express";
import { RATE_LIMIT_METADATA, RateLimitOptions } from "./rate-limit.decorator";

type RateBucket = {
  count: number;
  resetAt: number;
};

function firstHeaderValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function getClientIp(request: Request) {
  const forwardedFor = firstHeaderValue(request.headers["x-forwarded-for"]);
  const forwardedIp = forwardedFor?.split(",")[0]?.trim();
  return forwardedIp || request.ip || request.socket.remoteAddress || "unknown";
}

@Injectable()
export class RateLimitGuard implements CanActivate {
  private readonly buckets = new Map<string, RateBucket>();

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext) {
    const options = this.reflector.getAllAndOverride<RateLimitOptions | undefined>(RATE_LIMIT_METADATA, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!options) {
      return true;
    }

    const http = context.switchToHttp();
    const request = http.getRequest<Request>();
    const response = http.getResponse<Response>();
    const now = Date.now();
    const resetAt = now + options.windowSeconds * 1000;
    const key = `${options.name}:${getClientIp(request)}`;
    const existingBucket = this.buckets.get(key);
    const bucket = !existingBucket || existingBucket.resetAt <= now ? { count: 0, resetAt } : existingBucket;

    bucket.count += 1;
    this.buckets.set(key, bucket);
    this.cleanup(now);

    const remaining = Math.max(options.limit - bucket.count, 0);
    response.setHeader("X-RateLimit-Limit", String(options.limit));
    response.setHeader("X-RateLimit-Remaining", String(remaining));
    response.setHeader("X-RateLimit-Reset", String(Math.ceil(bucket.resetAt / 1000)));

    if (bucket.count > options.limit) {
      response.setHeader("Retry-After", String(Math.ceil((bucket.resetAt - now) / 1000)));
      throw new HttpException("Prea multe cereri. Te rugăm să încerci din nou mai târziu.", HttpStatus.TOO_MANY_REQUESTS);
    }

    return true;
  }

  private cleanup(now: number) {
    if (this.buckets.size < 5000) {
      return;
    }

    for (const [key, bucket] of this.buckets.entries()) {
      if (bucket.resetAt <= now) {
        this.buckets.delete(key);
      }
    }
  }
}
