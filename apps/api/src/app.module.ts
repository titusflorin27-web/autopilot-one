import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { HealthModule } from "./modules/health/health.module";
import { OrganizationsModule } from "./modules/organizations/organizations.module";
import { UsersModule } from "./modules/users/users.module";
import { EventsModule } from "./modules/events/events.module";
import { BusinessDnaModule } from "./modules/business-dna/business-dna.module";
import { PrismaService } from "./common/prisma.service";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    HealthModule,
    OrganizationsModule,
    UsersModule,
    EventsModule,
    BusinessDnaModule,
  ],
  providers: [PrismaService],
})
export class AppModule {}
