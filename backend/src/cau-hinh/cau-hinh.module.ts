import { Module } from "@nestjs/common";
import { CauHinhController } from "./cau-hinh.controller";
import { CauHinhService } from "./cau-hinh.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [CauHinhController],
  providers: [CauHinhService],
  exports: [CauHinhService],
})
export class CauHinhModule {}
