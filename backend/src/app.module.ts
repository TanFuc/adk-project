import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { AuthModule } from './auth/auth.module';
import { RegistrationModule } from './registration/registration.module';
import { ContentModule } from './content/content.module';
import { ConfigurationModule } from './configuration/configuration.module';
import { SectionModule } from './section/section.module';
import { BannerPopupModule } from './banner-popup/banner-popup.module';
import { EventModule } from './event/event.module';
import { BusinessModelModule } from './business-model/business-model.module';
import { PartnershipFaqModule } from './partnership-faq/partnership-faq.module';
import { ClickTrackingModule } from './click-tracking/click-tracking.module';

@Module({
  imports: [
    // Environment Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // In-memory Cache (Redis disabled)
    CacheModule.register({
      isGlobal: true,
      ttl: 300000, // 5 minutes
      max: 100, // max items
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
    // RedisModule, // Temporarily disabled - using in-memory cache above

    // Feature Modules
    AuthModule,
    RegistrationModule,
    ContentModule,
    ConfigurationModule,
    SectionModule,
    BannerPopupModule,
    EventModule,
    BusinessModelModule,
    PartnershipFaqModule,
    ClickTrackingModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
