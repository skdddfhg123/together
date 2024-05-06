import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JWTStrategy } from './jwt.strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/db/user/user.module';
import { UserCalendarModule } from 'src/db/user_calendar/userCalendar.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/user/entities/user.entity';
import { UserCalendar } from 'src/db/user_calendar/entities/userCalendar.entity';

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
    TypeOrmModule.forFeature([User, UserCalendar]),
    UserModule,
    UserCalendarModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    ConfigService,
    JWTStrategy,
  ],
  exports: [AuthService]
})
export class AuthModule { }