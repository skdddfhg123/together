import { Body, Controller, Get, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarCreateDto } from './dtos/calendar.create.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('calendar')
export class CalendarController {
    constructor(
        private calendarService: CalendarService,
    ) {}

    @Get()
    async getUsers() {
        return 'Get Users';
    }

    @Post()
    async createSchedule() {
        return 'Create Schedule';
    }

    @Post('/:id')
    @UseInterceptors(FileFieldsInterceptor([
        {name: 'cover_image', maxCount: 1},
        {name: 'banner_image', maxCount: 1}
    ]))
    async createCalendar(
        @Body() body: CalendarCreateDto, 
        @UploadedFile() cover_image?: Express.Multer.File,
        @UploadedFile() banner_image?: Express.Multer.File
    ) {

        return this.calendarService.createCalendar(body, cover_image, banner_image);
    }
}
