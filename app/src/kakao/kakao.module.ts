import { Module } from '@nestjs/common';
import { KakaoController } from './kakao.controller';
import { KakaoService } from './kakao.service';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from './utils/kakao.strategy';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    PassportModule,
    HttpModule,
  ],
  controllers: [KakaoController],
  providers: [KakaoService, KakaoStrategy]
})
export class KakaoModule {}
