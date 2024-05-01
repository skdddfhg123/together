import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GoogleService } from './google.service';
import { GoogleUser } from './utils/interface/google.interface';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SocialEventDto } from 'src/db/event/socialEvent/dtos/socialEvent.dto';
import { GetUser } from 'src/db/user/getUser.decorator';
import { JwtAuthGuard } from '../jwt.guard';
import { SocialEventService } from 'src/db/event/socialEvent/socialEvent.service';
import { SocialEvent } from 'src/db/event/socialEvent/entities/socialEvent.entity';
import { getPayload } from '../getPayload.decorator';
import { PayloadResponse } from '../dtos/payload-response';

@ApiTags('google')
@Controller('google')
export class GoogleController {
    constructor(
        private googleService: GoogleService,
        private socialEventService: SocialEventService,
    ) {}

    @Get('login')
    @UseGuards(AuthGuard('google'))
    async logInGoogleAuth(): Promise<void> {
    }

    @Get('redirect')
    // @UseGuards(JwtAuthGuard)
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Req() req, @Res() res: Response/*, @GetUser() user: User*/) {
        
        const googleUser = req.user as GoogleUser

        console.log(req.user.refreshToken);
        
        // const savedUser = await this.googleService.findByProviderIdOrSave(googleUser); // refresh Token bisuness logic

        console.log("refreshToken: " + googleUser.refreshToken);
        console.log("accessToken: " + googleUser.accessToken);

        const url = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
    
        // try {
        //     const response = await firstValueFrom(this.httpService.get(url, {
        //         headers: {
        //         'Authorization': `Bearer ${accessToken}`
        //         }
        //     }));
        // // console.log(response.data.items)
        //     return response.data.items;
        // } catch (error) {
        //     console.error('Error fetching calendar events:', error.response?.data);
        //   throw new InternalServerErrorException('Failed to fetch calendar events');
        // }

    }

    @Post('calendar')
    @ApiOperation({ summary: '구글 캘린더 API에서 일정 가져오기' })
    @ApiResponse({ status: 201, description: '성공 시 Google SocialEvent[]반환' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getKakaoCalendar(
        @getPayload() payload: PayloadResponse,
        @Body() body,
    ): Promise<Array<SocialEvent>> {
        const googleUser = body.googleToken;
        
        // const savedUser = await this.googleService.findByProviderIdOrSave(googleUser); // refresh Token bisuness logic

        const isValid = await this.googleService.verifyToken(googleUser);

        if(isValid)
        {
            const googleCalendars = await this.googleService.fetchCalendarEvents(googleUser.accessToken);

            await this.socialEventService.deleteAll('google', payload.userCalendarId)
            // console.log(googleCalendars)
            const savePromises = googleCalendars.map(event => {
                const socialEvent = new SocialEventDto();
                socialEvent.social = 'google';
                socialEvent.title = event.summary;
                socialEvent.startAt = event.start.date || event.start.dateTime;
                socialEvent.endAt = event.end.date || event.end.dateTime;
                const isSaved =  this.socialEventService.saveSocialCalendar(socialEvent, payload.userCalendarId);
                if(isSaved != null)
                    return isSaved
            })

            const resultArray = await Promise.all(savePromises);

            return resultArray;
        }
        else
        {
            // console.log('invalid token');
            throw new UnauthorizedException('Invalid Access Token');
        }
    }

    @Get('get/social')
    @ApiOperation({ summary: 'Google 소셜 이벤트 가져오기' })
    @ApiResponse({ status: 201, description: '성공 시 google SocialEvent[] 반환' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getSocialEventData(
        @getPayload() payload: PayloadResponse,
    ): Promise<SocialEvent[]> {
        const userCalendarId = payload.userCalendarId;
        const socialEvents = await this.socialEventService.findSocialEventsByUserCalendarId('google', userCalendarId);

        if(!socialEvents) {
            throw new HttpException('해당 유저의 데이터가 없습니다.', 404);
        }

        return socialEvents;
    }
}