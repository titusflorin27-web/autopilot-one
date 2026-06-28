import { DemoRequestStatus } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateDemoRequestStatusDto {
  @IsEnum(DemoRequestStatus)
  status!: DemoRequestStatus;
}
