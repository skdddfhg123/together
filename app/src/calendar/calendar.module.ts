import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.entity';
import { UserCalendarModule } from 'src/db/user_calendar/userCalendar.module';
import { JWTStrategy } from 'src/auth/jwt.strategy';
import { GroupEvent } from 'src/db/event/group_event/entities/groupEvent.entity';
import { GroupEventModule } from 'src/db/event/group_event/groupEvent.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Calendar, GroupEvent]),
    UserCalendarModule,
    GroupEventModule,
  ],
  controllers: [CalendarController],
  providers: [CalendarService, JWTStrategy]
})
export class CalendarModule {}
