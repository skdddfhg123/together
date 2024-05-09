import { HttpException, HttpStatus, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Calendar } from './entities/calendar.entity';
import { Repository } from 'typeorm';
import { CalendarCreateDto } from './dtos/calendar.create.dto';
import { PayloadResponse } from 'src/auth/dtos/payload-response';
import { UserCalendarService } from 'src/db/user_calendar/userCalendar.service';
import { CalendarUpdateDto } from './dtos/calendar.update.dto';
import { GroupEvent } from 'src/db/event/group_event/entities/groupEvent.entity';

@Injectable()
export class CalendarService {
    constructor(
        @InjectRepository(Calendar)
        private calendarRepository: Repository<Calendar>,
        @InjectRepository(GroupEvent)
        private groupEventRepository: Repository<GroupEvent>,
        private userCalendarService: UserCalendarService,
    ) { }

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
        newGroupCalendar.author = author;

        try {
            const savedGroupCalendar = await this.calendarRepository.save(newGroupCalendar);
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
                .andWhere("calendar.isDeleted = false")
                .orWhere(":userCalendarId = ANY(calendar.attendees)", { userCalendarId })
                .andWhere("calendar.isDeleted = false")
                .getMany();

            // if (calendars.length === 0) {
            //     throw new NotFoundException(`No calendars found associated with userCalendarId ${userCalendarId}`);
            // }
            return calendars;
        } catch (e) {
            console.error('Error occurred while fetching calendars:', e);
            throw new InternalServerErrorException('Failed to fetch calendars');
        }
    }

    async deleteCalendar(calendarId: string): Promise<void> {
        const calendar = await this.calendarRepository.findOne({
            where: { calendarId },
            relations: ['groupEvents']
        });

        if (!calendar) {
            throw new NotFoundException(`Calendar with ID ${calendarId} not found`);
        }

        calendar.isDeleted = true;
        calendar.deletedAt = new Date();

        if (calendar.groupEvents && calendar.groupEvents.length > 0) {
            for (const event of calendar.groupEvents) {
                event.isDeleted = true;
                event.deletedAt = new Date();
                await this.groupEventRepository.save(event);
            }
        }

        await this.calendarRepository.save(calendar);
    }

    async addAttendeeToCalendar(calendarId: string, payload: PayloadResponse): Promise<string> {
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
            return "Attendee added successfully!";
        } else {
            throw new HttpException('Attendee already exists.', HttpStatus.CONFLICT);
        }
    }

    async removeAttendeeFromCalendar(calendarId: string, userCalendarId: string): Promise<string> {
        const calendar = await this.calendarRepository.createQueryBuilder("calendar")
            .leftJoinAndSelect("calendar.author", "author")
            .where("calendar.calendarId = :calendarId", { calendarId })
            .getOne();

        if (!calendar) {
            throw new NotFoundException(`Calendar with ID ${calendarId} not found`);
        }

        const index = calendar.attendees.indexOf(userCalendarId);
        if (index !== -1) {
            calendar.attendees.splice(index, 1);
            if (calendar.author.userCalendarId === userCalendarId) {
                if (calendar.attendees.length > 0) {
                    const newAuthorId = calendar.attendees[0];
                    const newAuthor = await this.userCalendarService.findOne({ userCalendarId: newAuthorId });
                    console.log(newAuthor);
                    calendar.author = newAuthor;
                } else {
                    calendar.isDeleted = true;
                    calendar.deletedAt = new Date();
                }
            }
            await this.calendarRepository.save(calendar);
            return "Attendee removed successfully";
        } else {
            throw new HttpException("Attendee does not exist", HttpStatus.CONFLICT);
        }
    }
}
