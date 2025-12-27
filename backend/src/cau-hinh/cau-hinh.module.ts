import { Module } from '@nestjs/common';
import { CauHinhController } from './cau-hinh.controller';
import { CauHinhService } from './cau-hinh.service';

@Module({
  controllers: [CauHinhController],
  providers: [CauHinhService],
  exports: [CauHinhService],
})
export class CauHinhModule {}
