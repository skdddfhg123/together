import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEvent } from './entities/groupEvent.entity';
import { GroupEventService } from './groupEvent.service';
import { User } from 'src/db/user/entities/user.entity';
import { UserCalendar } from 'src/db/user_calendar/entities/userCalendar.entity';
import { UserModule } from 'src/db/user/user.module';
import { UserCalendarModule } from 'src/db/user_calendar/userCalendar.module';
import { CalendarModule } from 'src/calendar/calendar.module';
import { Calendar } from 'src/calendar/entities/calendar.entity';
import { UserService } from 'src/db/user/user.service';
import { CalendarService } from 'src/calendar/calendar.service';


@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEvent, User, UserCalendar, Calendar]),
    UserModule,
    UserCalendarModule,
    //CalendarModule,
  ],
  providers: [GroupEventService, UserService, CalendarService],
  exports: [GroupEventService, TypeOrmModule ]

})
export class GroupEventModule {}
