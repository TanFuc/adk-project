import { Module } from "@nestjs/common";
import { HoiDapHopTacController } from "./hoi-dap-hop-tac.controller";
import { HoiDapHopTacService } from "./hoi-dap-hop-tac.service";
import { AuthModule } from "../auth/auth.module";

@Module({
  imports: [AuthModule],
  controllers: [HoiDapHopTacController],
  providers: [HoiDapHopTacService],
  exports: [HoiDapHopTacService],
})
export class HoiDapHopTacModule {}
