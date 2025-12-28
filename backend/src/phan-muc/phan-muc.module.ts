import { Module } from "@nestjs/common";
import { PhanMucController } from "./phan-muc.controller";
import { PhanMucService } from "./phan-muc.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [PhanMucController],
  providers: [PhanMucService],
  exports: [PhanMucService],
})
export class PhanMucModule {}
