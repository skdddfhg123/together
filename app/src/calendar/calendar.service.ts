import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.entity';
import { Repository } from 'typeorm';
import { CalendarCreateDto } from './dtos/calendar.create.dto';
import { User } from 'src/db/user/entities/user.entity';
import { UserCalendar } from 'src/db/user_calendar/entities/userCalendar.entity';
import { PayloadResponse } from 'src/auth/dtos/payload-response';

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(Calendar) 
        private calendarRepository: Repository<Calendar>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(User)
        private readonly userCalendarRepository: Repository<UserCalendar>,
    ) {}

    async createGroupCalendar(body: CalendarCreateDto, payload: PayloadResponse): Promise<Calendar> {
        const { title, type } = body;

        const newGroupCalendar = new Calendar();
        // newGroupCalendar.author = 
        newGroupCalendar.title = title;
        newGroupCalendar.type = type;
        newGroupCalendar.userCalendars 

        const savedGroupCalendar = await this.calendarRepository.save(newGroupCalendar);

        
        
        return 
    }

    // async createCalendar(body: CalendarCreateDto, cover_image, banner_image): Promise<Calendar> {
    //     try{
    //         const { title, type, attendees } = body;
            
    //         const newCalendar = this.calendarRepository.save({title: title, type: type, cover_image: cover_image, banner_image: banner_image});
            

    //         if(newCalendar == null)
    //         {
    //             throw new HttpException('Saving in DB is failed', 500)
    //         }

    //         return newCalendar;
    //     }
    //     catch(err)
    //     {
    //         console.log(err);
    //         throw new HttpException('Unknown Err', 400)
    //     }
    // }
}
