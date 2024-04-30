import { Module } from '@nestjs/common';
import { KakaoController } from './kakao.controller';
import { KakaoService } from './kakao.service';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from './utils/strategy/kakao.strategy';
import { HttpModule } from '@nestjs/axios';
import { UserCalendarModule } from 'src/db/user_calendar/userCalendar.module';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    UserCalendarModule,
  ],
  controllers: [KakaoController],
  providers: [KakaoService, KakaoStrategy]
})
export class KakaoModule {}
