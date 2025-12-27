import { Module } from '@nestjs/common';
import { DangKyController } from './dang-ky.controller';
import { DangKyService } from './dang-ky.service';

@Module({
  controllers: [DangKyController],
  providers: [DangKyService],
  exports: [DangKyService],
})
export class DangKyModule {}
