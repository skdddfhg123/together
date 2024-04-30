import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { KakaoService, KakaoUser } from './kakao.service';

@Controller('kakao')
export class KakaoController {
    constructor(
        private kakaoService: KakaoService,
    ) {}

    @Get()
    @UseGuards(AuthGuard('kakao'))
    async logInKakao(): Promise<void> {

    }

    @Get('redirect')
    @UseGuards(AuthGuard('kakao'))
    async redirectKakaoLogIn(@Req() req, @Res() res: Response): Promise<void> {
        const kakaoUser = req.user as KakaoUser;

        // console.log("Kakao User Access Token: " + kakaoUser.accessToken);
        // console.log("Kakao User Refresh Token: "  + kakaoUser.refreshToken);
        // console.log('Kakao User name: ' + kakaoUser.name);
        // console.log('Kakao User email: ' + kakaoUser.email);
        return this.kakaoService.fetchCalendarEvents(kakaoUser.accessToken);
    }
}
