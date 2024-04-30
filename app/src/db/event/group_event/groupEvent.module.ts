import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEvent } from './entities/groupEvent.entity';
import { GroupEventService } from './groupEvent.service';
import { User } from 'src/db/user/entities/user.entity';
import { UserCalendar } from 'src/db/user_calendar/entities/userCalendar.entity';
import { UserModule } from 'src/db/user/user.module';
import { UserCalendarModule } from 'src/db/user_calendar/userCalendar.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEvent, User, UserCalendar]),
    UserModule,
    UserCalendarModule,
  ],
  providers: [GroupEventService],
  exports: [GroupEventService]

})
export class GroupEventModule {}
