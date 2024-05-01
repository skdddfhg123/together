import { Module } from '@nestjs/common';
import { KakaoController } from './kakao.controller';
import { KakaoService } from './kakao.service';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from './utils/strategy/kakao.strategy';
import { HttpModule } from '@nestjs/axios';
import { SocialEventModule } from 'src/db/event/socialEvent/socialEvent.module';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    SocialEventModule,
  ],
  controllers: [KakaoController],
  providers: [
    KakaoService,
    KakaoStrategy,
  ]
})
export class KakaoModule {}
