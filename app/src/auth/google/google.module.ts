import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './utils/strategy/google.strategy';
import { GoogleController } from './google.controller';
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
  controllers: [GoogleController],
  providers: [
    GoogleService,
    GoogleStrategy,
    JWTStrategy,
    RefreshStrategy,
  ],
  exports: [GoogleService],
})
export class GoogleModule{}