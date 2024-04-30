import { Module } from '@nestjs/common';
import { GoogleService } from './google.service';
import { HttpModule } from '@nestjs/axios';
import { PassportModule } from '@nestjs/passport';
import { GoogleStrategy } from './utils/strategy/google.strategy';
import { GoogleController } from './google.controller';
import { UserCalendarModule } from 'src/db/user_calendar/userCalendar.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from 'src/db/user/entities/user.entity';

@Module({
  imports: [
    PassportModule,
    HttpModule,
    UserCalendarModule,
    TypeOrmModule.forFeature([User])
  ],
  controllers: [GoogleController],
  providers: [
    GoogleService,
    GoogleStrategy,
  ],
  exports: [GoogleService],
})
export class GoogleModule{}