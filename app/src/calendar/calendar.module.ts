import { Module } from '@nestjs/common';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.entity';
import { GroupEventModule } from 'src/db/event/group_event/groupEvent.module';
import { JWTStrategy } from 'src/auth/jwt.strategy';

@Module({
  imports: [
    MulterModule.register({
      dest: './uploads',
    }),
    TypeOrmModule.forFeature([Calendar]),
    GroupEventModule,
  ],
  controllers: [CalendarController],
  providers: [CalendarService, JWTStrategy]
})
export class CalendarModule {}
