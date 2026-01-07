import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { ThrottlerModule, ThrottlerGuard } from "@nestjs/throttler";
import { CacheModule } from "@nestjs/cache-manager";
import { APP_GUARD } from "@nestjs/core";
import { PrismaModule } from "./prisma/prisma.module";
// import { RedisModule } from "./redis/redis.module"; // Temporarily disabled
import { DangKyModule } from "./dang-ky/dang-ky.module";
import { NoiDungModule } from "./noi-dung/noi-dung.module";
import { CauHinhModule } from "./cau-hinh/cau-hinh.module";
import { AuthModule } from "./auth/auth.module";
import { PhanMucModule } from "./phan-muc/phan-muc.module";
import { BannerPopupModule } from "./banner-popup/banner-popup.module";
import { SuKienModule } from "./su-kien/su-kien.module";
import { MoHinhKinhDoanhModule } from "./mo-hinh-kinh-doanh/mo-hinh-kinh-doanh.module";
import { HoiDapHopTacModule } from "./hoi-dap-hop-tac/hoi-dap-hop-tac.module";
import { ClickTrackingModule } from "./click-tracking/click-tracking.module";

@Module({
  imports: [
    // Environment Configuration
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ".env",
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
    DangKyModule,
    NoiDungModule,
    CauHinhModule,
    AuthModule,
    PhanMucModule,
    BannerPopupModule,
    SuKienModule,
    MoHinhKinhDoanhModule,
    HoiDapHopTacModule,
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
