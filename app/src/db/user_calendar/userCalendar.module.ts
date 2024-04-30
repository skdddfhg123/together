import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCalendar } from './entities/userCalendar.entity';
import { UserCalendarService } from './userCalendar.service';
import { GoogleModule } from 'src/auth/google/google.module';
import { SocialEvent } from './entities/socialEvent.entity';
import { User } from '../user/entities/user.entity';
import { UserModule } from '../user/user.module';


@Module({
  imports: [
    TypeOrmModule.forFeature([UserCalendar, SocialEvent, User]),
    UserModule,
  ],
  providers: [UserCalendarService],
  exports: [UserCalendarService]

})
export class UserCalendarModule {}
