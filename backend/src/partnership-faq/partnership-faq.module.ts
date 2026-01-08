import { Module } from '@nestjs/common';
import { PartnershipFaqController } from './partnership-faq.controller';
import { PartnershipFaqService } from './partnership-faq.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PartnershipFaqController],
  providers: [PartnershipFaqService],
  exports: [PartnershipFaqService],
})
export class PartnershipFaqModule {}
