import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { DangKyModule } from './dang-ky/dang-ky.module';
import { NoiDungModule } from './noi-dung/noi-dung.module';
import { CauHinhModule } from './cau-hinh/cau-hinh.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    // Environment Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // Rate Limiting
    ThrottlerModule.forRoot([
      {
        ttl: 60000, // 1 minute
        limit: 10, // 10 requests per minute for registration
      },
    ]),

    // Database & Cache
    PrismaModule,
    RedisModule,

    // Feature Modules
    DangKyModule,
    NoiDungModule,
    CauHinhModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
