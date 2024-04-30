import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.entity';
import { User } from 'src/db/user/entities/user.entity';
import { UserCalendar } from 'src/db/user_calendar/entities/userCalendar.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Calendar]),
    TypeOrmModule.forFeature([User]),
    TypeOrmModule.forFeature([UserCalendar]),  
  ],
  controllers: [CalendarController],
  providers: [CalendarService]
})
export class CalendarModule {}
