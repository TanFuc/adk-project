import { Module, Global } from "@nestjs/common";
import { CacheModule } from "@nestjs/cache-manager";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { redisStore } from "cache-manager-redis-yet";

@Global()
@Module({
  imports: [
    CacheModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => {
        const host = configService.get<string>("REDIS_HOST") || "localhost";
        const port = configService.get<number>("REDIS_PORT") || 6379;

        try {
          // Try to connect to Redis
          const store = await redisStore({
            socket: {
              host,
              port,
              connectTimeout: 5000, // 5 second timeout
            },
            ttl: 300000, // 5 minutes default TTL
          });

          console.log(`✅ Redis connected successfully at ${host}:${port}`);
          return { store };
        } catch (error) {
          // Fallback to in-memory cache if Redis is unavailable
          console.warn(
            `⚠️  Redis connection failed at ${host}:${port}. Using in-memory cache as fallback.`,
          );
          console.warn(
            `   To use Redis, please install and start it, or use Docker: docker run -d -p 6379:6379 redis:7-alpine`,
          );

          // Return in-memory cache configuration
          return {
            ttl: 300000, // 5 minutes default TTL
            max: 100, // Maximum number of items in cache
          };
        }
      },
      inject: [ConfigService],
    }),
  ],
  exports: [CacheModule],
})
export class RedisModule {}
