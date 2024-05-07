import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { RedisService } from './redis/redis.service';
import { RedisController } from './redis/redis.controller';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { KakaoModule } from './auth/kakao/kakao.module';
import { CalendarModule } from './calendar/calendar.module';
import { UserModule } from './db/user/user.module';
import { DataSource } from 'typeorm';
import { AuthLoggerMiddleware, CalendarLoggerMiddleware, FeedLoggerMiddleware, GroupEventLoggerMiddleware, KakaoLoggerMiddleware, LoggerMiddleware, PlatformLoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { GoogleModule } from './auth/google/google.module';
import { DiscordBotService } from './discordBot.service';
import { SocialEventModule } from './db/event/socialEvent/socialEvent.module';
import { FeedModule } from './feed/feed.module';
import { ImageModule } from './image.upload/image.module';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASS,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI),
    UserModule,
    AuthModule,
    CalendarModule,
    GoogleModule,
    KakaoModule,
    CalendarModule,
    SocialEventModule,
    FeedModule,
    ImageModule,
  ],
  controllers: [RedisController],
  providers: [RedisService, DiscordBotService],
  exports: [RedisService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log(dataSource.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*'); //option no 3
    // consumer.apply(AuthLoggerMiddleware).forRoutes('/auth');
    // consumer.apply(GroupEventLoggerMiddleware).forRoutes('/calendar/group');
    // consumer.apply(CalendarLoggerMiddleware).exclude('/calendar/group').forRoutes('/calendar');
    // consumer.apply(PlatformLoggerMiddleware).forRoutes('/google');
    // consumer.apply(KakaoLoggerMiddleware).forRoutes('/kakao');
    // consumer.apply(FeedLoggerMiddleware).forRoutes('/feed');
  }
}