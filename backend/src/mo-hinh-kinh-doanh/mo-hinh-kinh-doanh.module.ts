import { Module } from "@nestjs/common";
import { MoHinhKinhDoanhController } from "./mo-hinh-kinh-doanh.controller";
import { MoHinhKinhDoanhService } from "./mo-hinh-kinh-doanh.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [MoHinhKinhDoanhController],
  providers: [MoHinhKinhDoanhService],
  exports: [MoHinhKinhDoanhService],
})
export class MoHinhKinhDoanhModule {}
