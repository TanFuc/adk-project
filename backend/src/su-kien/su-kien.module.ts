import { Module } from "@nestjs/common";
import { SuKienController } from "./su-kien.controller";
import { SuKienService } from "./su-kien.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [SuKienController],
  providers: [SuKienService],
  exports: [SuKienService],
})
export class SuKienModule {}
