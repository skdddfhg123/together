import { Module } from '@nestjs/common';
import { KakaoController } from './kakao.controller';
import { KakaoService } from './kakao.service';
import { PassportModule } from '@nestjs/passport';
import { KakaoStrategy } from './utils/strategy/kakao.strategy';
import { HttpModule } from '@nestjs/axios';
import { SocialEventModule } from 'src/db/event/socialEvent/socialEvent.module';
import { TokensModule } from 'src/db/tokens/tokens.module';
import { JWTStrategy } from '../strategy/jwt.strategy';
import { RefreshStrategy } from '../strategy/refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    PassportModule,
    HttpModule,
    SocialEventModule,
    TokensModule,
  ],
  controllers: [KakaoController],
  providers: [
    KakaoService,
    KakaoStrategy,
    JWTStrategy,
    RefreshStrategy,
  ]
})
export class KakaoModule {}
