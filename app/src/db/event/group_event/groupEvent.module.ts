import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEvent } from './entities/groupEvent.entity';
import { GroupEventService } from './groupEvent.service';
import { Calendar } from 'src/calendar/entities/calendar.entity';
import { UserService } from 'src/db/user/user.service';
import { CalendarService } from 'src/calendar/calendar.service';
import { User } from 'src/db/user/entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEvent, Calendar]),
  ],
  providers: [GroupEventService],
  exports: [GroupEventService]

})
export class GroupEventModule { }
