import { Body, Controller, Get, Param, Patch, Post, Req, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarCreateDto } from './dtos/calendar.create.dto';
import { getPayload } from 'src/auth/getPayload.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PayloadResponse } from 'src/auth/dtos/payload-response';
import { JwtAuthGuard } from 'src/auth/jwt.guard';
import { Calendar } from './entities/calendar.entity';
import { UserCalendarService } from 'src/db/user_calendar/userCalendar.service';
import { GroupEventService } from 'src/db/event/group_event/groupEvent.service';
import { CreateGroupEventDTO } from 'src/db/event/group_event/dtos/groupEvent.create.dto';
import { GroupEvent } from 'src/db/event/group_event/entities/groupEvent.entity';

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

    @Get('get_calendar')
    @ApiOperation({ summary: 'Get all group calendars for a user' })
    @ApiResponse({ status: 200, description: 'Calendars retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Calendars not found' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getGroupCalendar(
        @getPayload() payload: PayloadResponse
    ): Promise<Calendar[]> {
        return await this.calendarService.findCalendarsByUserCalendarId(payload.userCalendarId);
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
    
    @Post('group/create/:calendarid')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async createGroupEvent(
         @Body() groupEventDTO: CreateGroupEventDTO,
         @getPayload() payload: PayloadResponse,
         @Param('calendarid') calendarId: string 
    ): Promise<GroupEvent>{
        try {
            const groupEvent = await this.groupEventService.createGroupEvent(groupEventDTO, payload, calendarId);
            return groupEvent;
        } catch (e) {
            throw e; 
        }
       
    }

    @Get('group/get/')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getGroupEventByMonth(/*@Param('yearmonth') yearmonth: string*/): Promise<GroupEvent[]>{
        try {
        const groupEvent = await this.groupEventService.getGroupEventbyMonth(/*yearmonth*/);
            return groupEvent;
        } catch (e) {
            throw e; 
        }
    }


    // @Get('group/get/:groupeventid')
    // @ApiBearerAuth('JWT-auth')
    // @UseGuards(JwtAuthGuard)
    // async getOneGroupEvent(@Param('groupeventid') groupEventId: string): Promise<GroupEvent>{
    //     try {
    //     const groupEvent = await this.groupEventService.getGroupEvent(groupEventId);
    //         return groupEvent;
    //     } catch (e) {
    //         throw e; 
    //     }
    // }

    @Get('group/get/:calendarid')
    @ApiParam({ name: 'calendarid', required: true, description: 'Calendar ID', type: String })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getAllGroupEvent(
        @Param('calendarid') calendarid: string,
    ): Promise<GroupEvent[]>{
        return await this.groupEventService.getAllGroupEventsByCalendarId(calendarid);
    }


    
    @Patch('group/update/:groupeventid')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getGroupEventUpdateForm(
        @Param('groupeventid') groupEventId: string,
        // @getPayload() payload: PayloadResponse
    ): Promise<GroupEvent>{
        try {
        const groupEvent = await this.groupEventService.getGroupEventUpdateForm(groupEventId);
            return groupEvent;
        } catch (e) {
            throw e; 
        }
    }
    

    @Post('group/update/:groupeventid')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async updateGroupEvent(
        @Param('groupeventid') groupEventId: string, 
        @Body() groupEventDTO: CreateGroupEventDTO
    ): Promise<GroupEvent>{
        try {
        const groupEvent = await this.groupEventService.updateGroupEvent(groupEventId, groupEventDTO);
            return groupEvent;
        } catch (e) {
            throw e; 
        }
    }


    @Patch('group/remove/:groupeventid')
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async removeGroupEvent(@Param('groupeventid') groupEventId: string): Promise<GroupEvent>{
        try {
        const groupEvent = await this.groupEventService.removeGroupEvent(groupEventId);
            return groupEvent;
        } catch (e) {
            throw e; 
        }
    }

    

    // 




}
