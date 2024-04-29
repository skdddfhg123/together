import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { RedisService } from './redis/redis.service';
import { RedisController } from './redis/redis.controller';
import { CacheModule } from '@nestjs/cache-manager';
import { UserModule } from './user/user.module';
import * as redisStore from 'cache-manager-ioredis';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    CacheModule.register({
      isGlobal: true,
      store: redisStore,
      host: process.env.REDIS_HOST,
      port: parseInt(process.env.REDIS_PORT),
      password: process.env.REDIS_PASS,
    }),
    UserModule
  ],
  controllers: [
    AppController,
    RedisController,
  ],
  providers: [
    AppService,
    RedisService,
  ],
  exports: [RedisService],
})
export class AppModule {}
