import { Body, Controller, Get, Post, UploadedFile, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CalendarService } from './calendar.service';
//import { CalendarCreateDto } from './dtos/calendar.create.dto';
//import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { GroupEventService } from 'src/db/event/group_event/groupEvent.service';
import { GroupEvent } from 'src/db/event/group_event/entities/groupEvent.entity';
import { CreateGroupEventDTO } from 'src/db/event/group_event/dtos/groupEvent.create.dto';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/jwt.guard';

@ApiTags('calendar')
@Controller('calendar')
export class CalendarController {
    constructor(
        private calendarService: CalendarService,
        private groupEventService : GroupEventService,
    ) {}

    // @Get()
    // async getUsers() {
    //     return 'Get Users';
    // }

    // @Post()
    // async createSchedule() {
    //     return 'Create Schedule';
    // }

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

    
    @Post('group/create')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async createGroupEvent(
        // @Body() groupEventDTO: CreateGroupEventDTO
    )/*: Promise<GroupEvent>*/{
        // try {
        //     const groupEvent = await this.groupEventService.createGroupEvent(groupEventDTO);
        //     return groupEvent;
        // } catch (e) {
        //     throw e; 
        // }
        return 'Create Group Event'
    }

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
