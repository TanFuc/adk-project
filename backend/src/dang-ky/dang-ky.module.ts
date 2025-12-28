import { Module } from "@nestjs/common";
import { DangKyController } from "./dang-ky.controller";
import { DangKyService } from "./dang-ky.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [DangKyController],
  providers: [DangKyService],
  exports: [DangKyService],
})
export class DangKyModule {}
