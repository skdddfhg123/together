import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GroupEvent } from './entities/groupEvent.entity';
import { GroupEventService } from './groupEvent.service';
import { Calendar } from 'src/calendar/entities/calendar.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([GroupEvent, Calendar]),
  ],
  providers: [GroupEventService],
  exports: [GroupEventService]

})
export class GroupEventModule {}
