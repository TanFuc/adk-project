import { Module } from "@nestjs/common";
import { NoiDungController } from "./noi-dung.controller";
import { NoiDungService } from "./noi-dung.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [NoiDungController],
  providers: [NoiDungService],
  exports: [NoiDungService],
})
export class NoiDungModule {}
