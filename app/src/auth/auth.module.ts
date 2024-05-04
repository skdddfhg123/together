import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTStrategy } from './strategy/jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/db/user/user.module';
import { UserCalendarModule } from 'src/db/user_calendar/userCalendar.module';
import { TokensModule } from 'src/db/tokens/tokens.module';
import { RefreshStrategy } from './strategy/refresh.strategy';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    UserCalendarModule,
    TokensModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService, 
    ConfigService,
    JWTStrategy,
    RefreshStrategy,
  ],
  exports: [AuthService]
})
export class AuthModule {}