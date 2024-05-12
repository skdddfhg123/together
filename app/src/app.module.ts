import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { RedisService } from './webSocket/redis/redis.service';
import { RedisController } from './webSocket/redis/redis.controller';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { KakaoModule } from './auth/kakao/kakao.module';
import { CalendarModule } from './calendar/calendar.module';
import { UserModule } from './db/user/user.module';
import { DataSource } from 'typeorm';
import { AuthLoggerMiddleware, CalendarLoggerMiddleware, FeedLoggerMiddleware, GroupEventLoggerMiddleware, KakaoLoggerMiddleware, LoggerMiddleware, PlatformLoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { GoogleModule } from './auth/google/google.module';
import { FeedModule } from './feed/feed.module';
import { ImageModule } from './image.upload/image.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UtilModule } from './util/util.module';
import { EmojiModule } from './emoji/emoji.module';
import { EventModule } from './webSocket/event.module';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { EventEmitterModule } from '@nestjs/event-emitter';

@Module({
  imports: [
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env'
    }),
    TypeOrmModule.forRoot(typeORMConfig),
    MongooseModule.forRoot(process.env.MONGO_URI),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASS,
    }),
    ClientsModule.register([
      {
        name: 'Test',
        transport: Transport.REDIS,
        options: {
          host: process.env.REDIS_HOST,
          port: parseInt(process.env.REDIS_PORT),
          password: process.env.REDIS_PASS,
        }
      },
    ]),
    UtilModule,
    UserModule,
    AuthModule,
    CalendarModule,
    GoogleModule,
    KakaoModule,
    FeedModule,
    ImageModule,
    EmojiModule,
    EventModule,
  ],
  controllers: [RedisController],
  providers: [RedisService],
  exports: [RedisService],
})
export class AppModule implements NestModule {
  constructor(private dataSource: DataSource) {
    console.log(dataSource.driver.database);
  }
  configure(consumer: MiddlewareConsumer) {
    // consumer.apply(LoggerMiddleware).forRoutes('*'); //option no 3
    // consumer.apply(AuthLoggerMiddleware).forRoutes('/auth');
    // consumer.apply(GroupEventLoggerMiddleware).forRoutes('/calendar/group');
    // consumer.apply(CalendarLoggerMiddleware).exclude('/calendar/group').forRoutes('/calendar');
    // consumer.apply(PlatformLoggerMiddleware).forRoutes('/google');
    // consumer.apply(KakaoLoggerMiddleware).forRoutes('/kakao');
    // consumer.apply(FeedLoggerMiddleware).forRoutes('/feed');
  }
}