import { HttpException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.entity';
import { Repository } from 'typeorm';
import { CalendarCreateDto } from './dtos/calendar.create.dto';
import { User } from 'src/db/user/entities/user.entity';
import { UserCalendar } from 'src/db/user_calendar/entities/userCalendar.entity';
import { PayloadResponse } from 'src/auth/dtos/payload-response';
import { UserService } from 'src/db/user/user.service';
import { UserCalendarService } from 'src/db/user_calendar/userCalendar.service';

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(Calendar) 
        private calendarRepository: Repository<Calendar>,
        // @InjectRepository(User)
        // private readonly userRepository: Repository<User>,
        // @InjectRepository(UserCalendar)
        // private readonly userCalendarRepository: Repository<UserCalendar>,
        private userService: UserService,
        private userCalendarService: UserCalendarService,
    ) {}

    async createGroupCalendar(body: CalendarCreateDto, payload: PayloadResponse): Promise<Calendar> {
        const { title, type } = body;

        const newGroupCalendar = new Calendar();
        const author = await this.userService.findOne({ useremail: payload.useremail });
        if (!author) {
            throw new UnauthorizedException("User not found");
        }
        newGroupCalendar.authorId = author.userId;
        newGroupCalendar.title = title;
        newGroupCalendar.type = type;
        
        const userCalendar = await this.userCalendarService.findOne({ userCalendarId: payload.userCalendarId });
        console.log('UserCalendar ID:', userCalendar.userCalendarId);
        if (!userCalendar) {
            throw new UnauthorizedException("UserCalendar not found");
        }
        
        newGroupCalendar.userCalendars = [userCalendar];

        try {
            const savedGroupCalendar = await this.calendarRepository.save(newGroupCalendar);
            console.log('Saved Group Calendar:', savedGroupCalendar);
            return savedGroupCalendar;
        } catch (e) {
            console.error('Error saving group calendar:', e);
            throw new InternalServerErrorException('Error saving group calendar');
        }
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
