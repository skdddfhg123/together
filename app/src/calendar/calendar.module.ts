import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.entity';
import { User } from 'src/db/user/entities/user.entity';
import { UserCalendar } from 'src/db/user_calendar/entities/userCalendar.entity';
import { UserModule } from 'src/db/user/user.module';
import { UserCalendarService } from 'src/db/user_calendar/userCalendar.service';
import { UserCalendarModule } from 'src/db/user_calendar/userCalendar.module';
import { GroupEventModule } from 'src/db/event/group_event/groupEvent.module';
import { JWTStrategy } from 'src/auth/strategy/jwt.strategy';
import { GroupEvent } from 'src/db/event/group_event/entities/groupEvent.entity';
import { TokensModule } from 'src/db/tokens/tokens.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Calendar, GroupEvent]),
    CalendarModule,
    UserModule,
    UserCalendarModule,
    TokensModule,
    GroupEventModule,
  ],
  controllers: [CalendarController],
  providers: [CalendarService, JWTStrategy]
})
export class CalendarModule {}
