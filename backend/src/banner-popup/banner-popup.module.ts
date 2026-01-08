import { Module } from '@nestjs/common';
import { BannerPopupController } from './banner-popup.controller';
import { BannerPopupService } from './banner-popup.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BannerPopupController],
  providers: [BannerPopupService],
  exports: [BannerPopupService],
})
export class BannerPopupModule {}
