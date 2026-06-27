import "reflect-metadata";
import { NestFactory } from "@nestjs/core";
import { Logger, ValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NextFunction, Request, Response } from "express";
import { AppModule } from "./app.module";

function parseCsv(value?: string): string[] {
  return (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);
  const logger = new Logger("Bootstrap");
  const corsOrigins = parseCsv(config.get<string>("API_CORS_ORIGINS"));

  app.setGlobalPrefix("api");
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.enableCors({
    origin: corsOrigins.length ? corsOrigins : true,
    credentials: true,
  });

  app.use((request: Request, response: Response, next: NextFunction) => {
    response.setHeader("X-Content-Type-Options", "nosniff");
    response.setHeader("X-Frame-Options", "DENY");
    response.setHeader("Referrer-Policy", "no-referrer");
    response.setHeader("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
    next();
  });

  app.use((request: Request, response: Response, next: NextFunction) => {
    const startedAt = Date.now();
    response.on("finish", () => {
      logger.log(`${request.method} ${request.originalUrl} ${response.statusCode} ${Date.now() - startedAt}ms`);
    });
    next();
  });

  const port = config.get<number>("API_PORT") ?? 4000;
  await app.listen(port);
  logger.log(`Autopilot API listening on port ${port}`);
}

bootstrap();
