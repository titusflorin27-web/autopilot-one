import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestExpressApplication } from "@nestjs/platform-express";
import { json, NextFunction, Request, Response, urlencoded } from "express";
import { AppModule } from "./app.module";

const DEFAULT_CORS_ORIGINS = [
  "http://localhost:3000",
  "https://app.autopilot-one.com",
  "https://autopilot-one.com",
  "https://www.autopilot-one.com",
];

function parseCsv(value?: string): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function unique(values: string[]) {
  return [...new Set(values)];
}

function redactUrl(url: string) {
  return url
    .replace(/([?&](?:token|accessToken|refreshToken|apiKey|key|secret)=)[^&]+/gi, "$1[redacted]")
    .replace(/(widget-token=)[^&]+/gi, "$1[redacted]");
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { bodyParser: false });
  const config = app.get(ConfigService);
  const logger = new Logger("Bootstrap");
  const bodyLimit = config.get<string>("API_BODY_LIMIT") ?? "256kb";
  const corsOrigins = unique([...DEFAULT_CORS_ORIGINS, ...parseCsv(config.get<string>("API_CORS_ORIGINS"))]);

  app.disable("x-powered-by");
  app.set("trust proxy", 1);
  app.use(json({
    limit: bodyLimit,
    verify: (request, _response, buffer) => {
      if (request.headers["stripe-signature"]) {
        (request as Request & { rawBody?: Buffer }).rawBody = Buffer.from(buffer);
      }
    },
  }));
  app.use(urlencoded({ extended: true, limit: bodyLimit }));

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin(origin, callback) {
      if (!origin || corsOrigins.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Authorization", "Content-Type", "X-Requested-With"],
    maxAge: 86_400,
  });

  app.use((request: Request, response: Response, next: NextFunction) => {
    response.removeHeader("X-Powered-By");
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("Referrer-Policy", "no-referrer");
    response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    response.setHeader("Cross-Origin-Opener-Policy", "same-origin");
    response.setHeader("Cross-Origin-Resource-Policy", "same-site");
    response.setHeader("Content-Security-Policy", "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'");
    response.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
    next();
  });

  app.use((request: Request, response: Response, next: NextFunction) => {
    const startedAt = Date.now();
    response.on("finish", () => {
      logger.log(`${request.method} ${redactUrl(request.originalUrl)} ${response.statusCode} ${Date.now() - startedAt}ms`);
    });
    next();
  });

  const port = config.get<number>("API_PORT") ?? 4000;
  await app.listen(port);
  logger.log(`Autopilot API listening on port ${port}`);
}

bootstrap();
