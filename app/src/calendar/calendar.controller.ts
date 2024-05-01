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
import { CalendarUpdateDto } from './dtos/calendar.update.dto';

@ApiTags("calendar")
@Controller('calendar')
export class CalendarController {
    constructor(
        private calendarService: CalendarService,
        private groupEventService : GroupEventService,
    ) {}

    @Post('create')
    @ApiOperation({ summary: '그룹 캘린더 생성' })
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
    @ApiOperation({ summary: '전체 그룹 캘린더 가져오기' })
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

    @Patch('update/:calendarId')
    @ApiOperation({ summary: '캘린더 정보 업데이트' })
    @ApiResponse({ status: 200, description: 'Calendar updated successfully' })
    @ApiResponse({ status: 404, description: 'Calendar not found' })
    @ApiResponse({ status: 403, description: 'Forbidden Permission Error' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async updateGroupCalendar(
        @Param('calendarId') calendarId: string,
        @Body() calendarUpdateDto: CalendarUpdateDto,
        @getPayload() payload: PayloadResponse
    ): Promise<Calendar> {
        return await this.calendarService.updateGroupCalendar(calendarId, calendarUpdateDto, payload);
    }

    // 캘린더 삭제 (하위 그룹 이벤트 순회 돌면서 일정 삭제)

    @Patch('add_attendee/:calendarId')
    @ApiOperation({ summary: '그룹 캘린더 참여하기' })
    @ApiResponse({ status: 200, description: 'Attendee added successfully' })
    @ApiResponse({ status: 404, description: 'CalendarId is not found' })
    @ApiResponse({ status: 409, description: 'Attendee already exists.' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async addAttendee(
        @Param('calendarId') calendarId: string,
        @getPayload() payload: PayloadResponse
    ): Promise<string> {
        return this.calendarService.addAttendeeToCalendar(calendarId, payload);
    }
    
    @Post('group/create/:calendarId')
    @ApiOperation({ summary: '그룹 이벤트 만들기' })
    @ApiResponse({ status: 201, description: 'GroupEvent added successfully' })
    @ApiResponse({ status: 403, description: 'You do not have permission to add an event to this calendar' })
    @ApiResponse({ status: 404, description: "Calendar not found" })
    @ApiResponse({ status: 500, description: 'Error saving group event' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async createGroupEvent(
         @Body() groupEventDTO: CreateGroupEventDTO,
         @getPayload() payload: PayloadResponse,
         @Param('calendarId') calendarId: string 
    ): Promise<GroupEvent>{
        return await this.groupEventService.createGroupEvent(groupEventDTO, payload, calendarId);
    }

    @Get('group/get/:calendarId')
    @ApiOperation({ summary: '그룹 이벤트 가져오기' })
    @ApiResponse({ status: 200, description: 'Get GroupEvent successfully' })
    @ApiResponse({ status: 500, description: 'Failed to fetch group events for calendar ID' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getAllGroupEvent(
        @Param('calendarid') calendarid: string,
    ): Promise<GroupEvent[]>{
        return await this.groupEventService.getAllGroupEventsByCalendarId(calendarid);
    }

    @Get('group/get/:groupeventid')
    @ApiOperation({ summary: '특정 그룹 이벤트 가져오기' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getGroupEventUpdateForm(
        @Param('groupeventid') groupEventId: string,
    ): Promise<GroupEvent>{
        return await this.groupEventService.getGroupEventUpdateForm(groupEventId);
    }

    // @Get('group/get/')
    // @ApiBearerAuth('JWT-auth')
    // @UseGuards(JwtAuthGuard)
    // async getGroupEventByMonth(/*@Param('yearmonth') yearmonth: string*/): Promise<GroupEvent[]>{
    //     try {
    //     const groupEvent = await this.groupEventService.getGroupEventbyMonth(/*yearmonth*/);
    //         return groupEvent;
    //     } catch (e) {
    //         throw e; 
    //     }
    // }


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

}
