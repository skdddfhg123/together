import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.entity';
import { UserCalendarModule } from 'src/db/user_calendar/userCalendar.module';
import { JWTStrategy } from 'src/auth/strategy/jwt.strategy';
import { GroupEvent } from 'src/db/event/group_event/entities/groupEvent.entity';
import { TokensModule } from 'src/db/tokens/tokens.module';
import { RefreshStrategy } from 'src/auth/strategy/refresh.strategy';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GroupEventModule } from 'src/db/event/group_event/groupEvent.module';
import { UserCalendar } from 'src/db/user_calendar/entities/userCalendar.entity';
import { UtilsModule } from 'src/utils/utils.module';
import { UtilsService } from 'src/utils/utils.service';

@Module({
  imports: [
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
      }),
      inject: [ConfigService],
    }),
    TypeOrmModule.forFeature([Calendar, GroupEvent, UserCalendar]),
    UserCalendarModule,
    TokensModule,
    GroupEventModule,
    // UtilsModule,
  ],
  controllers: [CalendarController],
  providers: [CalendarService, JWTStrategy, RefreshStrategy, UtilsService]
})
export class CalendarModule { }
