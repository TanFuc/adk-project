import { Module } from "@nestjs/common";
import { ClickTrackingController } from "./click-tracking.controller";
import { ClickTrackingService } from "./click-tracking.service";
import { PrismaModule } from "../prisma/prisma.module";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [ClickTrackingController],
  providers: [ClickTrackingService],
  exports: [ClickTrackingService],
})
export class ClickTrackingModule {}
