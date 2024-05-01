import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { KakaoService } from './kakao.service';
import { KakaoUser } from './utils/interface/kakao.interface';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserCalendarService } from 'src/db/user_calendar/userCalendar.service';
import { SocialEventDto } from 'src/db/user_calendar/dtos/socialEvent.dto';

@ApiTags('kakao')
@Controller('kakao')
export class KakaoController {
    constructor(
        private kakaoService: KakaoService,
        private userCalendarService: UserCalendarService,
    ) {}

    @ApiResponse({
        status: 201,
        description: '성공 시 해당 response 반환'
    })
    @Get('login')
    @UseGuards(AuthGuard('kakao'))
    async logInKakao(): Promise<void> {

    }

    @ApiResponse({
        status: 201,
        description: '성공 시 해당 response 반환',
        type: String
    })
    @Get('redirect')
    // @UseGuards(JwtAuthGuard)
    @UseGuards(AuthGuard('kakao'))
    async redirectKakaoLogIn(@Req() req, @Res() res: Response): Promise<void> {
        const kakaoUser = req.user as KakaoUser;

        const tempArray = []

        for (let i = 1; i <= 12; i++) {
            let month = '' + i;
            let day = 31;

            if((i - 10) <= -1) {
                month = '0' + i;
            }

            const KakaoCalendars = await this.kakaoService.fetchCalendarEvents(kakaoUser.accessToken, month, day);
            
            if(KakaoCalendars.length != 0) {
                tempArray.push(...KakaoCalendars)
            }
        }
        // console.log(KakaoCalendars)
        for (let i = 0; i < tempArray.length; i++) {
            const event = tempArray[i];
            const socialEvent = new SocialEventDto();
            socialEvent.social = 'kakao';
            socialEvent.startAt = event.time.start_at;
            socialEvent.endAt = event.time.end_at;
            await this.userCalendarService.saveSocialCalendar(socialEvent/*, user*/);
        }
    }
}