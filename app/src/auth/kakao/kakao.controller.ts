import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { KakaoService } from './kakao.service';
import { KakaoUser } from './utils/interface/kakao.interface';
import { ApiTags } from '@nestjs/swagger';
import { UserCalendarService } from 'src/db/user_calendar/userCalendar.service';
import { SocialEvent } from 'src/db/user_calendar/entities/socialEvent.entity';
import { SocialEventDto } from 'src/db/user_calendar/dtos/socialEvent.dto';
import { JwtAuthGuard } from '../jwt.guard';

@ApiTags('kakao')
@Controller('kakao')
export class KakaoController {
    constructor(
        private kakaoService: KakaoService,
        private userCalendarService: UserCalendarService,
    ) {}

    @Get('login')
    @UseGuards(AuthGuard('kakao'))
    async logInKakao(): Promise<void> {

    }

    @Get('redirect')
    // @UseGuards(JwtAuthGuard)
    @UseGuards(AuthGuard('kakao'))
    async redirectKakaoLogIn(@Req() req, @Res() res: Response): Promise<void> {
        const kakaoUser = req.user as KakaoUser;

        const KakaoCalendars = await this.kakaoService.fetchCalendarEvents(kakaoUser.accessToken);
        // console.log(KakaoCalendars)
        for (let i = 0; i < KakaoCalendars.length; i++) {
            const event = KakaoCalendars[i];
            const socialEvent = new SocialEventDto();
            socialEvent.social = 'kakao';
            socialEvent.startAt = event.time.start_at;
            socialEvent.endAt = event.time.end_at;
            await this.userCalendarService.saveSocialCalendar(socialEvent/*, user*/);
        }
    }
}
