import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, NotFoundException, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { CalendarCreateDto } from './dtos/calendar.create.dto';
import { getPayload } from 'src/auth/getPayload.decorator';
import { ApiBearerAuth, ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PayloadResponse } from 'src/auth/dtos/payload-response';
import { JwtAuthGuard } from 'src/auth/strategy/jwt.guard';
import { Calendar } from './entities/calendar.entity';
import { GroupEventService } from 'src/db/event/group_event/groupEvent.service';
import { CreateGroupEventDTO } from 'src/db/event/group_event/dtos/groupEvent.create.dto';
import { GroupEvent } from 'src/db/event/group_event/entities/groupEvent.entity';
import { CalendarUpdateDto } from './dtos/calendar.update.dto';
import { UpdateGroupEventDTO } from 'src/db/event/group_event/dtos/groupEvent.update.dto';
import { RefreshAuthGuard } from 'src/auth/strategy/refresh.guard';
import { GetGroupDTO } from 'src/db/event/group_event/dtos/groupEvent.get.dto';
import { RedisService } from 'src/webSocket/redis/redis.service';

@ApiTags("calendar")
@Controller('calendar')
export class CalendarController {
    constructor(
        private calendarService: CalendarService,
        private groupEventService: GroupEventService,
    ) { }

    // 최신화 완료
    @Post('create')
    @ApiOperation({ summary: '그룹 캘린더 생성' })
    @ApiResponse({ status: 201, description: 'Calendar created successfully' })
    @ApiResponse({ status: 403, description: 'Forbidden' })
    @ApiBearerAuth('JWT-auth')
    @ApiBody({ type: CalendarCreateDto })
    @UseGuards(JwtAuthGuard)
    // @UseGuards(RefreshAuthGuard)
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
    // @UseGuards(RefreshAuthGuard)
    async getGroupCalendar(
        @getPayload() payload: PayloadResponse
    ): Promise<Calendar[]> {
        return await this.calendarService.findCalendarsByUserCalendarId(payload.userCalendarId);
    }

    @Get('get_calendar/v2')
    @ApiOperation({ summary: '전체 그룹 캘린더 가져오기' })
    @ApiResponse({ status: 200, description: 'Calendars retrieved successfully' })
    @ApiResponse({ status: 404, description: 'Calendars not found' })
    @ApiResponse({ status: 500, description: 'Internal Server Error' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    // @UseGuards(RefreshAuthGuard)
    async getGroupCalendarV2(
        @getPayload() payload: PayloadResponse
    ): Promise<Calendar[]> {
        return await this.calendarService.findCalendarsByUserCalendarIdV2(payload.userCalendarId);
    }

    @Patch('update/:calendarId')
    @ApiOperation({ summary: '캘린더 정보 업데이트' })
    @ApiResponse({ status: 200, description: 'Calendar updated successfully' })
    @ApiResponse({ status: 404, description: 'Calendar not found' })
    @ApiResponse({ status: 403, description: 'Forbidden Permission Error' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    // @UseGuards(RefreshAuthGuard)
    async updateGroupCalendar(
        @Param('calendarId') calendarId: string,
        @Body() calendarUpdateDto: CalendarUpdateDto,
        @getPayload() payload: PayloadResponse
    ): Promise<Calendar> {
        return await this.calendarService.updateGroupCalendar(calendarId, calendarUpdateDto, payload);
    }

    @Patch('delete/:calendarId')
    @ApiOperation({ summary: '캘린더 삭제' })
    @ApiResponse({ status: 204, description: 'Calendar and associated group events deleted successfully' })
    @ApiResponse({ status: 404, description: 'Calendar not found' })
    @ApiResponse({ status: 500, description: 'Failed to delete calendar' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    @HttpCode(HttpStatus.NO_CONTENT)
    async deleteCalendar(@Param('calendarId') calendarId: string): Promise<any> {
        try {
            await this.calendarService.deleteCalendar(calendarId);
        } catch (error) {
            if (error instanceof NotFoundException) {
                throw new NotFoundException(`Calendar with ID ${calendarId} not found`);
            } else {
                throw new HttpException(
                    {
                        status: HttpStatus.INTERNAL_SERVER_ERROR,
                        error: 'Failed to delete calendar',
                    },
                    HttpStatus.INTERNAL_SERVER_ERROR,
                );
            }
        }
    }

    // 최신화 완료
    @Patch('participate/:calendarId')
    @ApiOperation({ summary: '그룹 캘린더 참여하기' })
    @ApiResponse({ status: 200, description: 'Attendee added successfully' })
    @ApiResponse({ status: 404, description: 'CalendarId is not found' })
    @ApiResponse({ status: 409, description: 'Attendee already exists.' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    // @UseGuards(RefreshAuthGuard)
    async addAttendee(
        @Param('calendarId') calendarId: string,
        @getPayload() payload: PayloadResponse
    ): Promise<string> {
        // 채팅방 참여
        return this.calendarService.addAttendeeToCalendar(calendarId, payload);
    }

    // 최신화 완료
    @Patch('withdraw/:calendarId')
    @ApiOperation({ summary: '그룹 캘린더 나가기' })
    @ApiResponse({ status: 200, description: 'Attendee removed successfully' })
    @ApiResponse({ status: 404, description: 'CalendarId is not found' })
    @ApiResponse({ status: 409, description: 'Attendee does not exist.' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    // @UseGuards(RefreshAuthGuard)
    async subAttendee(
        @Param('calendarId') calendarId: string,
        @getPayload() payload: PayloadResponse
    ): Promise<string> {
        //채팅방 나가기
        return this.calendarService.removeAttendeeFromCalendar(calendarId, payload.userCalendarId);
    }

    @Post('group/create/:calendarId')
    @ApiOperation({ summary: '그룹 이벤트 만들기' })
    @ApiResponse({ status: 201, description: 'GroupEvent added successfully' })
    @ApiResponse({ status: 403, description: 'You do not have permission to add an event to this calendar' })
    @ApiResponse({ status: 404, description: "Calendar not found" })
    @ApiResponse({ status: 500, description: 'Error saving group event' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    // @UseGuards(RefreshAuthGuard)
    async createGroupEvent(
        @Body() groupEventDTO: CreateGroupEventDTO,
        @getPayload() payload: PayloadResponse,
        @Param('calendarId') calendarId: string
    ): Promise<GroupEvent> {
        return await this.groupEventService.createGroupEvent(groupEventDTO, payload, calendarId);
    }

    @Get('group/get/all/:calendarId')
    @ApiOperation({ summary: '캘린더 그룹 이벤트 가져오기' })
    @ApiResponse({ status: 200, description: 'Get GroupEvent successfully' })
    @ApiResponse({ status: 500, description: 'Failed to fetch group events for calendar ID' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    // @UseGuards(RefreshAuthGuard)
    async getAllGroupEvent(
        @Param('calendarId') calendarId: string,
    ): Promise<GroupEvent[]> {
        console.log(calendarId);
        return await this.groupEventService.getAllGroupEventsByCalendarId(calendarId);
    }

    @Get('group/get/all/v2/:calendarId')
    @ApiOperation({ summary: '캘린더 별 그룹 일정 가져오기(필터:45일전후)' })
    @ApiResponse({ status: 200, description: 'Get GroupEvent successfully' })
    @ApiResponse({ status: 500, description: 'Failed to fetch group events for calendar ID' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    // @UseGuards(RefreshAuthGuard)
    async getAllGroupEvent2(
        @Param('calendarId') calendarId: string,
    ): Promise<any> {
        console.log(calendarId);
        return await this.groupEventService.getAllGroupEventsByCalendarIdV2(calendarId);
    }

    @Get('group/get/v2/:calendarId')
    @ApiOperation({ summary: '캘린더 그룹 이벤트 가져오기' })
    @ApiResponse({ status: 200, description: 'Get GroupEvent successfully' })
    @ApiResponse({ status: 500, description: 'Failed to fetch group events for calendar ID' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    // @UseGuards(RefreshAuthGuard)
    async getAllGroupEvent23(
        @Param('calendarId') calendarId: string,
    ): Promise<GetGroupDTO[]> {
        console.log(calendarId);
        return await this.groupEventService.getAllGroupEventsByCalendarId2(calendarId);
    }

    @Get('group/get/detail/:groupeventId')
    @ApiOperation({ summary: '특정 그룹 이벤트 가져오기' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    // @UseGuards(RefreshAuthGuard)
    async getGroupEventUpdateForm(
        @Param('groupeventid') groupEventId: string,
    ): Promise<GroupEvent> {
        return await this.groupEventService.getGroupEventUpdateForm(groupEventId);
    }

    @Patch('group/update/:groupeventId')
    @ApiOperation({ summary: '그룹 이벤트 업데이트' })
    @ApiResponse({ status: 200, description: 'Group event updated successfully' })
    @ApiResponse({ status: 404, description: 'Group event not found' })
    @ApiResponse({ status: 500, description: 'Error updating group event' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    // @UseGuards(RefreshAuthGuard)
    async updateGroupEvent(
        @Param('groupeventId') groupEventId: string,
        @Body() groupEventDTO: UpdateGroupEventDTO
    ): Promise<GroupEvent> {
        return await this.groupEventService.updateGroupEvent(groupEventId, groupEventDTO);
    }

    @Patch('group/remove/:groupeventId')
    @ApiOperation({ summary: '그룹 이벤트 제거' })
    @ApiResponse({ status: 200, description: 'Group event removed successfully' })
    @ApiResponse({ status: 403, description: 'You do not have permission to remove this event' })
    @ApiResponse({ status: 404, description: 'Group event not found' })
    @ApiResponse({ status: 500, description: 'Error removing group event' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    // @UseGuards(RefreshAuthGuard)
    async removeGroupEvent(
        @Param('groupeventId') groupEventId: string
    ): Promise<GroupEvent> {
        return await this.groupEventService.removeGroupEvent(groupEventId);
    }
}
