import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { RedisService } from './redis/redis.service';
import { RedisController } from './redis/redis.controller';
import { CacheModule } from '@nestjs/cache-manager';
import * as redisStore from 'cache-manager-ioredis';
import { AuthModule } from './auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { KakaoModule } from './auth/kakao/kakao.module';
import { CalendarModule } from './calendar/calendar.module';
import { UserModule } from './db/user/user.module';
import { DataSource } from 'typeorm';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware';
import { GroupEventModule } from './db/event/group_event/groupEvent.module';
import { GoogleModule } from './auth/google/google.module';
import { DiscordBotService } from './discordBot.service';
import { SocialEventModule } from './db/event/socialEvent/socialEvent.module';

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
    UserModule,
    AuthModule,
    
    GoogleModule,
    KakaoModule,
    CalendarModule,
    GroupEventModule,
    SocialEventModule,
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
  }
}