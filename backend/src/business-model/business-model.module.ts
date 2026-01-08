import { Module } from '@nestjs/common';
import { BusinessModelController } from './business-model.controller';
import { BusinessModelService } from './business-model.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [BusinessModelController],
  providers: [BusinessModelService],
  exports: [BusinessModelService],
})
export class BusinessModelModule {}
