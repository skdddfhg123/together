import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/db/user/user.module';
import { UserCalendarModule } from 'src/db/user_calendar/userCalendar.module';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
          secret: configService.get<string>('JWT_SECRET'),
          signOptions: {
            expiresIn: '1d',
          },
      }),
      inject: [ConfigService],
      }),
    UserModule,
    UserCalendarModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, ConfigService, JWTStrategy],
  exports: [AuthService]
})
export class AuthModule {}