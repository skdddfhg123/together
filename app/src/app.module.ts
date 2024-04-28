import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeORMConfig } from './config/typeorm.config';
import { KakaoModule } from './kakao/kakao.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(typeORMConfig),
    KakaoModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
