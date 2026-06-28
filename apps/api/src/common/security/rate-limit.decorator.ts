import { SetMetadata } from "@nestjs/common";

export const RATE_LIMIT_METADATA = "autopilot:rate-limit";

export type RateLimitOptions = {
  name: string;
  limit: number;
  windowSeconds: number;
};

export function RateLimit(options: RateLimitOptions) {
  return SetMetadata(RATE_LIMIT_METADATA, options);
}
