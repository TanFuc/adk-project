import { Module } from '@nestjs/common';
import { PhotoCategoryController } from './photo-category.controller';
import { PhotoCategoryService } from './photo-category.service';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [AuthModule],
  controllers: [PhotoCategoryController],
  providers: [PhotoCategoryService],
  exports: [PhotoCategoryService],
})
export class PhotoCategoryModule {}
