import { Body, Controller, Get, HttpException, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SocialEventDto } from 'src/db/event/socialEvent/dtos/socialEvent.dto';
import { JwtAuthGuard } from '../strategy/jwt.guard';
import { SocialEventService } from 'src/db/event/socialEvent/socialEvent.service';
import { SocialEvent } from 'src/db/event/socialEvent/entities/socialEvent.entity';
import { getPayload } from '../getPayload.decorator';
import { PayloadResponse } from '../dtos/payload-response';
import { GetTokenDto } from '../dtos/getToken.dto';
import { RefreshAuthGuard } from '../strategy/refresh.guard';
import { AzureService } from './azure.service';

@ApiTags('azure')
@Controller('azure')
export class AzureController {
    constructor(
        private azureService: AzureService,
        private socialEventService: SocialEventService,
    ) {}


    @Get('login')
    @UseGuards(AuthGuard('azure'))
    async login() {
        // passport는 자동으로 이 경로를 리다이렉트 처리합니다.
    }

    @Get('redirect')
    @UseGuards(AuthGuard('azure'))
    async redirect(@Req() req) {
        // 사용자 정보와 토큰을 반환합니다.
        return req.user;
    }
    

    @Post('calendar')
    @ApiOperation({ summary: 'Outlook 캘린더 API에서 일정 가져오기' })
    @ApiResponse({ status: 201, description: '성공 시 Outlook SocialEvent[]반환' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    // @UseGuards(RefreshAuthGuard)
    async getOutlookCalendar(
        @getPayload() payload: PayloadResponse,
        @Body() body: GetTokenDto,
    ): Promise<Array<SocialEvent>> {
        const azureUser = body.azureAccessToken;

        const isValid = await this.azureService.verifyToken(azureUser);

        if(isValid) {
            const outlookCalendars = await this.azureService.fetchCalendarEvents(azureUser);

            await this.socialEventService.deleteSocialEvents('azure', payload.userCalendarId)

            const savePromises = outlookCalendars.map(event => {
                const socialEvent = new SocialEventDto();
                socialEvent.social = 'azure';
                socialEvent.title = event.summary;
                socialEvent.startAt = event.start.date || event.start.dateTime;
                socialEvent.endAt = event.end.date || event.end.dateTime;
                return this.socialEventService.saveSocialCalendar(socialEvent, payload.userCalendarId);
            })

            const resultArray = await Promise.all(savePromises);

            return resultArray;
        }
        else {
            throw new UnauthorizedException('Invalid Access Token');
        }
    }

    @Get('get/social')
    @ApiOperation({ summary: 'Outlook 소셜 이벤트 가져오기' })
    @ApiResponse({ status: 201, description: '성공 시 Outlook SocialEvent[] 반환' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    // @UseGuards(RefreshAuthGuard)
    async getSocialEventData(
        @getPayload() payload: PayloadResponse,
    ): Promise<SocialEvent[]> {
        const userCalendarId = payload.userCalendarId;
        const socialEvents = await this.socialEventService.findSocialEventsByUserCalendarId('azure', userCalendarId);

        if(!socialEvents) {
            throw new HttpException('해당 유저의 데이터가 없습니다.', 404);
        }

        return socialEvents;
    }
}