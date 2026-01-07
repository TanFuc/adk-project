import { Module } from "@nestjs/common";
import { ClickTrackingController } from "./click-tracking.controller";
import { ClickTrackingService } from "./click-tracking.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ClickTrackingController],
  providers: [ClickTrackingService],
  exports: [ClickTrackingService],
})
export class ClickTrackingModule {}
