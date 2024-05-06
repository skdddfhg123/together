import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/user/entities/user.entity';
import { UserCalendar } from 'src/db/user_calendar/entities/userCalendar.entity';
import { UserModule } from 'src/db/user/user.module';
import { UserCalendarModule } from 'src/db/user_calendar/userCalendar.module';
import { CalendarModule } from 'src/calendar/calendar.module';
import { Calendar } from 'src/calendar/entities/calendar.entity';
import { UserService } from 'src/db/user/user.service';
import { CalendarService } from 'src/calendar/calendar.service';
import { SocialEventService } from './socialEvent.service';
import { SocialEvent } from './entities/socialEvent.entity';
import { GroupEvent } from '../group_event/entities/groupEvent.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([ SocialEvent ,User, UserCalendar, Calendar, GroupEvent]),
    UserModule,
    UserCalendarModule,
    //CalendarModule,
  ],
  providers: [SocialEventService, UserService, CalendarService],
  exports: [SocialEventService]
})
export class SocialEventModule {}
