import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCalendar } from './entities/userCalendar.entity';
import { UserCalendarService } from './userCalendar.service';
import { SocialEvent } from '../event/group_event/entities/socialEvent.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';
import { UserService } from '../user/user.service';
import { Calendar } from 'src/calendar/entities/calendar.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserCalendar, SocialEvent, User, Calendar]),
    UserModule,
  ],
  providers: [
        UserCalendarService,
        UserService,
    ],
  exports: [UserCalendarService]

})
export class UserCalendarModule {}
