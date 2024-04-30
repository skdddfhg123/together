import { Body, Controller, Get, Param, Patch, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarCreateDto } from './dtos/calendar.create.dto';
import { getPayload } from 'src/auth/getPayload.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PayloadResponse } from 'src/auth/dtos/payload-response';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Calendar } from './entities/calendar.entity';
import { UserCalendarService } from 'src/db/user_calendar/userCalendar.service';
import { GroupEventService } from 'src/db/event/group_event/groupEvent.service';

@ApiTags("calendar")
@Controller('calendar')
export class CalendarController {
    constructor(
        private calendarService: CalendarService,
        private groupEventService : GroupEventService,
        // private userCalendarService: UserCalendarService,
    ) {}

    @Post('/create')
    @ApiOperation({ summary: 'Create a new group calendar' })
    @ApiResponse({ status: 201, description: 'Calendar created successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiBearerAuth('JWT-auth')
    @ApiBody({ type: CalendarCreateDto })
    @UseGuards(JwtAuthGuard)
    async createGroupCalendar(
      @Body() calendarCreateDto: CalendarCreateDto,
      @getPayload() payload: PayloadResponse
    ): Promise<Calendar> {
        return await this.calendarService.createGroupCalendar(calendarCreateDto, payload);
    }

    @Patch('add_attendee/:calendarId')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async addAttendee(
        @Param('calendarId') calendarId: string,
        @getPayload() payload: PayloadResponse
    ): Promise<{status: number, message: string}> {
        return this.calendarService.addAttendeeToCalendar(calendarId, payload);
    }
    // @Get('/groupCalendar')
    // @ApiBearerAuth('JWT-auth')
    // @UseGuards(JwtAuthGuard)
    // async findAllGroupCalendar(
    //     @getPayload() payload: PayloadResponse
    // ): Promise<Calendar[] | void> {
        
    //     return await this.userCalendarService.findGroupCalendar(payload);
    // }

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
