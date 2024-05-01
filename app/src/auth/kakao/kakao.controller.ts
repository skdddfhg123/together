import { Body, Controller, Get, HttpException, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { KakaoService } from './kakao.service';
import { KakaoUser } from './utils/interface/kakao.interface';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SocialEventDto } from 'src/db/event/socialEvent/dtos/socialEvent.dto';
import { SocialEvent } from 'src/db/event/socialEvent/entities/socialEvent.entity';
import { JwtAuthGuard } from '../jwt.guard';
import { SocialEventService } from 'src/db/event/socialEvent/socialEvent.service';
import { getPayload } from '../getPayload.decorator';
import { PayloadResponse } from '../dtos/payload-response';


@ApiTags('kakao')
@Controller('kakao')
export class KakaoController {
    constructor(
        private kakaoService: KakaoService,
        private socialEventService: SocialEventService,
    ) {}

    @Get('login')
    @UseGuards(AuthGuard('kakao'))
    async logInKakao(): Promise<void> {

    }

    @Get('redirect')
    @UseGuards(AuthGuard('kakao'))
    async redirectKakaoLogIn(@Req() req, @Res() res: Response): Promise<void> {
        const kakaoUser = req.user as KakaoUser;

        // const kakaoEventArray = await this.kakaoService.getKakaoEvents(kakaoUser.accessToken);

        console.log("kakaoUser.accessToken: " + kakaoUser.accessToken)

        console.log("kakaoUser.refreshToken: " + kakaoUser.refreshToken)

        // const isValid = await this.kakaoService.verifyKakaoToken(kakaoUser.refreshToken);
        const newAccessToken = this.kakaoService.refreshAccessToken(kakaoUser.refreshToken);
        console.log((await newAccessToken).toString())
    }

    @Post('calendar')
    @ApiOperation({ summary: '카카오 톡캘린더 API에서 일정 가져오기' })
    @ApiResponse({ status: 201, description: '성공 시 Kakao SocialEvent[] 반환' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getKakaoCalendar(
        @getPayload() payload: PayloadResponse,
        @Body() body,
    ): Promise<Array<SocialEvent>> {
        const kakaoUser = body.kakaoToken;
        
        const kakaoEventArray = await this.kakaoService.getKakaoEvents(kakaoUser);

        const isValid = await this.kakaoService.verifyKakaoToken(kakaoUser);

        if(isValid) {
            await this.socialEventService.deleteAll('kakao', payload.userCalendarId)
    
            const savePromises = kakaoEventArray.map(event => {
                const socialEvent = new SocialEventDto();
                socialEvent.social = 'kakao';
                socialEvent.startAt = event.time.start_at;
                socialEvent.endAt = event.time.end_at;
                const isSaved =  this.socialEventService.saveSocialCalendar(socialEvent, payload.userCalendarId);
                if(isSaved != null)
                    return isSaved
            })
    
            const resultArray = await Promise.all(savePromises);
    
            const temp = resultArray.filter(element => element != null);
    
            return temp;
        }
        else {
            throw new UnauthorizedException('Invalid Access Token');
        }
    }

    @Get('get/social')
    @ApiOperation({ summary: 'Kakao 소셜 이벤트 가져오기' })
    @ApiResponse({ status: 201, description: '성공 시 Kakao SocialEvent[] 반환' })
    @ApiBearerAuth('JWT-auth')
    @UseGuards(JwtAuthGuard)
    async getSocialEventData(
        @getPayload() payload: PayloadResponse,
    ): Promise<SocialEvent[]> {
        const userCalendarId = payload.userCalendarId;
        const socialEvents = await this.socialEventService.findSocialEventsByUserCalendarId('kakao', userCalendarId);

        if(!socialEvents) {
            throw new HttpException('해당 유저의 데이터가 없습니다.', 404);
        }

        return socialEvents;
    }
}