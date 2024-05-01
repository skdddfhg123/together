import { ForbiddenException, HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.entity';
import { Any, In, Raw, Repository } from 'typeorm';
import { CalendarCreateDto } from './dtos/calendar.create.dto';
import { User } from 'src/db/user/entities/user.entity';
import { UserCalendar } from 'src/db/user_calendar/entities/userCalendar.entity';
import { PayloadResponse } from 'src/auth/dtos/payload-response';
import { UserService } from 'src/db/user/user.service';
import { UserCalendarService } from 'src/db/user_calendar/userCalendar.service';
import { CalendarUpdateDto } from './dtos/calendar.update.dto';

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(Calendar) 
        private calendarRepository: Repository<Calendar>,
        private userService: UserService,
        private userCalendarService: UserCalendarService,
    ) {}

    // async createGroupCalendar(body: CalendarCreateDto, payload: PayloadResponse): Promise<Calendar> {
    //     const { title, type } = body;

    //     const newGroupCalendar = new Calendar();
    //     const author = await this.userService.findOne({ useremail: payload.useremail });
    //     if (!author) {
    //         throw new UnauthorizedException("User not found");
    //     }
    //     newGroupCalendar.title = title;
    //     newGroupCalendar.type = type;
    //     newGroupCalendar.attendees = [payload.userCalendarId];
    //     newGroupCalendar.author = author;
        
    //     const userCalendar = await this.userCalendarService.findOne({ userCalendarId: payload.userCalendarId });
    //     console.log('UserCalendar ID:', userCalendar.userCalendarId);
    //     if (!userCalendar) {
    //         throw new UnauthorizedException("UserCalendar not found");
    //     }
        
    //     newGroupCalendar.author = userCalendar;

    //     try {
    //         const savedGroupCalendar = await this.calendarRepository.save(newGroupCalendar);
    //         console.log('Saved Group Calendar:', savedGroupCalendar);
    //         return savedGroupCalendar;
    //     } catch (e) {
    //         console.error('Error saving group calendar:', e);
    //         throw new InternalServerErrorException('Error saving group calendar');
    //     }
    // }

    async createGroupCalendar(body: CalendarCreateDto, payload: PayloadResponse): Promise<Calendar> {
        const { title, type } = body;
    
        const author = await this.userCalendarService.findOne({ userCalendarId: payload.userCalendarId });
        if (!author) {
            throw new NotFoundException("UserCalendar not found");
        }
    
        const newGroupCalendar = new Calendar();
        newGroupCalendar.title = title;
        newGroupCalendar.type = type;
        newGroupCalendar.attendees = [payload.userCalendarId];
        newGroupCalendar.author = author;  // 할당된 UserCalendar 인스턴스 사용
    
        try {
            const savedGroupCalendar = await this.calendarRepository.save(newGroupCalendar);
            // console.log('Saved Group Calendar:', savedGroupCalendar);
            return savedGroupCalendar;
        } catch (e) {
            console.error('Error saving group calendar:', e);
            throw new InternalServerErrorException('Error saving group calendar');
        }
    }

    async updateGroupCalendar(calendarId: string, body: CalendarUpdateDto, payload: PayloadResponse): Promise<Calendar> {
        // Ensure payload is not null and has all required properties
        if (!payload || typeof payload.userCalendarId !== 'string') {
            throw new Error('Invalid payload: Payload is missing or userCalendarId is not provided');
        }
        // Using QueryBuilder to safely query arrays with parameters
        const calendar = await this.calendarRepository.createQueryBuilder("calendar")
            .where("calendar.calendarId = :calendarId", { calendarId })
            .andWhere(":userCalendarId = ANY(calendar.attendees)", { userCalendarId: payload.userCalendarId })
            .getOne();
        if (!calendar) {
            throw new NotFoundException(`Calendar with ID ${calendarId} not found`);
        }
        // if (calendar.author?.userCalendarId !== payload.userCalendarId) {
        //     throw new ForbiddenException("You do not have permission to update this calendar.");
        // }
    
        // Update fields if they are present in the body
        if (body.title) {
            calendar.title = body.title;
        }
        if (body.type) {
            calendar.type = body.type;
        }
    
        // Try to save the updated calendar
        try {
            return await this.calendarRepository.save(calendar);
        } catch (e) {
            console.error("Error updating calendar:", e);
            throw new InternalServerErrorException('Error updating group calendar');
        }
    }

    async findCalendarsByUserCalendarId(userCalendarId: string): Promise<Calendar[]> {
        try {
          const calendars = await this.calendarRepository
            .createQueryBuilder("calendar")
            .leftJoinAndSelect("calendar.author", "author")
            .where("author.userCalendarId = :userCalendarId", { userCalendarId })
            .orWhere(":userCalendarId = ANY(calendar.attendees)", { userCalendarId })
            .getMany();
    
          if (calendars.length === 0) {
            throw new NotFoundException(`No calendars found associated with userCalendarId ${userCalendarId}`);
          }
          return calendars;
        } catch (e) {
          console.error('Error occurred while fetching calendars:', e);
          throw new InternalServerErrorException('Failed to fetch calendars');
        }
    }

    async addAttendeeToCalendar(calendarId: string, payload: PayloadResponse):Promise<string> {
        const calendar = await this.calendarRepository.findOne({
            where: { calendarId },
        });
    
        if (!calendar) {
            throw new NotFoundException(`Calendar with ID ${calendarId} not found`);
        }
        const userCalendarId = payload.userCalendarId;

        if (!calendar.attendees.includes(userCalendarId)) {
            calendar.attendees.push(userCalendarId);
            await this.calendarRepository.save(calendar);
            return  "Attendee added successfully!" ;
        } else {
            throw new HttpException('Attendee already exists.', HttpStatus.CONFLICT);
        }
    }
}
