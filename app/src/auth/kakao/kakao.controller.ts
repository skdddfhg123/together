import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { KakaoService } from './kakao.service';
import { KakaoUser } from './utils/interface/kakao.interface';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UserCalendarService } from 'src/db/user_calendar/userCalendar.service';
import { SocialEventDto } from 'src/db/user_calendar/dtos/socialEvent.dto';
import { SocialEvent } from 'src/db/event/group_event/entities/socialEvent.entity';

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
    async redirectKakaoLogIn(@Req() req, @Res() res: Response): Promise<Array<SocialEvent>> {
        const kakaoUser = req.user as KakaoUser;

        const kakaoEventArray = await this.kakaoService.getKakaoEvents(kakaoUser.accessToken);

        const savePromises = kakaoEventArray.map(event => {
            const socialEvent = new SocialEventDto();
            socialEvent.social = 'kakao';
            socialEvent.startAt = event.time.start_at;
            socialEvent.endAt = event.time.end_at;
            return this.userCalendarService.saveSocialCalendar(socialEvent/*, user*/);
        })

        const resultArray = await Promise.all(savePromises);

        return resultArray;
    }
}