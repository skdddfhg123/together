import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserCalendarModule } from 'src/db/user_calendar/userCalendar.module';
import { SocialEventService } from './socialEvent.service';
import { SocialEvent } from './entities/socialEvent.entity';

@Module({
  imports: [
  TypeOrmModule.forFeature([ SocialEvent ]),
    UserCalendarModule,
  ],
  providers: [SocialEventService, /*UserService, CalendarService*/],
  exports: [SocialEventService]
})
export class SocialEventModule {}
