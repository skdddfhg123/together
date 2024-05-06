import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCalendar } from './entities/userCalendar.entity';
import { UserCalendarService } from './userCalendar.service';
import { User } from '../user/entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserCalendar, User]),
  ],
  providers: [ UserCalendarService ],
  exports: [ UserCalendarService ]

})
export class UserCalendarModule {}
