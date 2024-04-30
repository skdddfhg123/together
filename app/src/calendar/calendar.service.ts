import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CalendarEntity } from './entities/calendar.entity';
import { Repository } from 'typeorm';
import { CalendarCreateDto } from './dtos/calendar.create.dto';

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(CalendarEntity) 
        private readonly calendarRepository: Repository<CalendarEntity>
    ) {}

    async createCalendar(body: CalendarCreateDto, cover_image, banner_image): Promise<CalendarEntity> {
        try{
            const { title, type, attendees } = body;
            
            const newCalendar = this.calendarRepository.save({title: title, type: type, cover_image: cover_image, banner_image: banner_image});
            

            if(newCalendar == null)
            {
                throw new HttpException('Saving in DB is failed', 500)
            }

            return newCalendar;
        }
        catch(err)
        {
            console.log(err);
            throw new HttpException('Unknown Err', 400)
        }
    }
}
