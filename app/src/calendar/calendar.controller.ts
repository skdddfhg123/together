import { Body, Controller, Get, Param, Patch, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarCreateDto } from './dtos/calendar.create.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
    constructor(
        private calendarService: CalendarService,
        private groupEventService : GroupEventService,
        // private userCalendarService: UserCalendarService,
    ) {}

    @Get()
    async getSocialSchedule() {
        return 'Get Users';
    }

    @Post()
    async createSchedule() {
        return 'Create Schedule';
    }

    // @Post('/:id')
    // @UseInterceptors(FileFieldsInterceptor([
    //     {name: 'cover_image', maxCount: 1},
    //     {name: 'banner_image', maxCount: 1}
    // ]))
    // async createCalendar(
    //     @Body() body: CalendarCreateDto, 
    //     @UploadedFile() cover_image?: Express.Multer.File,
    //     @UploadedFile() banner_image?: Express.Multer.File
    // ) {
    // @Post('/:id')
    // @UseInterceptors(FileFieldsInterceptor([
    //     {name: 'cover_image', maxCount: 1},
    //     {name: 'banner_image', maxCount: 1}
    // ]))
    // async createCalendar(
    //     @Body() body: CalendarCreateDto, 
    //     @UploadedFile() cover_image?: Express.Multer.File,
    //     @UploadedFile() banner_image?: Express.Multer.File
    // ) {

    //     return this.calendarService.createCalendar(body, cover_image, banner_image);
    // }

    
    // @Post('group/create')
    // @ApiBearerAuth('JWT-auth')
    // @UseGuards(JwtAuthGuard)
    // async createGroupEvent(
    //     // @Body() groupEventDTO: CreateGroupEventDTO
    // )/*: Promise<GroupEvent>*/{
    //     // try {
    //     //     const groupEvent = await this.groupEventService.createGroupEvent(groupEventDTO);
    //     //     return groupEvent;
    //     // } catch (e) {
    //     //     throw e; 
    //     // }
    //     return 'Create Group Event'
    // }

    /*
    @Get('group/update')
    @UseGuards(AuthGuard())
    async updateGroupEvent(@Body() groupEventDTO: CreateGroupEventDTO): Promise<GroupEvent>{
        try {
        const groupEvent = await this.groupEventService.updataGroupEvent(groupEventDTO);
            return groupEvent;
        } catch (e) {
            throw e; 
        }
    }
    */

    // @Post('group/update')
    // @UseGuards(AuthGuard())
    // async updateGroupEvent(@Body() groupEventDTO: CreateGroupEventDTO): Promise<GroupEvent>{
    //     try {
    //     const groupEvent = await this.groupEventService.updataGroupEvent(groupEventDTO);
    //         return groupEvent;
    //     } catch (e) {
    //         throw e; 
    //     }
    // }

    // @Post('group/remove')
    // @UseGuards(AuthGuard())
    // async removeGroupEvent(@Body() groupEventDTO: CreateGroupEventDTO): Promise<GroupEvent>{
    //     try {
    //     const groupEvent = await this.groupEventService.removeGroupEvent(groupEventDTO);
    //         return groupEvent;
    //     } catch (e) {
    //         throw e; 
    //     }
    // }

    // @Get('group/get')
    // @UseGuards(AuthGuard())
    // async getGroupEvent(@Body() groupEventDTO: CreateGroupEventDTO): Promise<GroupEvent>{
    //     try {
    //     const groupEvent = await this.groupEventService.getGroupEvent(groupEventDTO);
    //         return groupEvent;
    //     } catch (e) {
    //         throw e; 
    //     }
    // }

    // 




}
