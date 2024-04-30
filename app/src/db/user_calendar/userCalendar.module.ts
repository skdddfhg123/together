import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCalendar } from './entities/userCalendar.entity';
import { UserCalendarService } from './userCalendar.service';
import { UserService } from '../user/user.service';
import { UserModule } from '../user/user.module';
import { User } from '../user/entities/user.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserCalendar]),
    TypeOrmModule.forFeature([User]),
  ],
  providers: [
        UserCalendarService,
        UserService,
    ],
  exports: [UserCalendarService]

})
export class UserCalendarModule {}
