import { Module } from '@nestjs/common';
import { NoiDungController } from './noi-dung.controller';
import { NoiDungService } from './noi-dung.service';

@Module({
  controllers: [NoiDungController],
  providers: [NoiDungService],
  exports: [NoiDungService],
})
export class NoiDungModule {}
