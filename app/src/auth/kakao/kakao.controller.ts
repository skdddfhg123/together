import { Body, Controller, Get, Post, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { KakaoService } from './kakao.service';
import { KakaoUser } from './utils/interface/kakao.interface';
import { ApiBearerAuth, ApiResponse, ApiTags } from '@nestjs/swagger';
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

    // @ApiResponse({
    //     status: 201,
    //     description: '성공 시 해당 response 반환'
    // })
    // @Get('login')
    // @UseGuards(AuthGuard('kakao'))
    // async logInKakao(): Promise<void> {

    // }

    // @ApiResponse({
    //     status: 201,
    //     description: '성공 시 해당 response 반환',
    //     type: String
    // })
    // @Get('redirect')
    // // @UseGuards(JwtAuthGuard)
    // @UseGuards(AuthGuard('kakao'))
    // async redirectKakaoLogIn(@Req() req, @Res() res: Response): Promise<Array<SocialEvent>> {
    //     const kakaoUser = req.user as KakaoUser;

    //     const kakaoEventArray = await this.kakaoService.getKakaoEvents(kakaoUser.accessToken);

    //     await this.socialEventService.deleteAll('kakao')

    //     const savePromises = kakaoEventArray.map(event => {
    //         const socialEvent = new SocialEventDto();
    //         socialEvent.social = 'kakao';
    //         socialEvent.startAt = event.time.start_at;
    //         socialEvent.endAt = event.time.end_at;
    //         const isSaved =  this.socialEventService.saveSocialCalendar(socialEvent, );
    //         return isSaved
    //     })

    //     const resultArray = await Promise.all(savePromises);

    //     const temp = resultArray.filter(element => element != null);

    //     return temp;
    // }

    @ApiResponse({
        status: 201,
        description: '성공 시 해당 response 반환',
        type: Array<SocialEvent>,
    })
    // @ApiBearerAuth('JWT-auth')
    @Post('calendar')
    @UseGuards(JwtAuthGuard)
    async getKakaoCalendar(
        @getPayload() payload: PayloadResponse,
        @Body() body,
    ): Promise<Array<SocialEvent>> {
        const kakaoUser = body.kakaoToken;

        // console.log("JWT: " + payload.userCalendarId);
        // console.log("body.kakaoToken: " + body.kakaoToken);
        
        const kakaoEventArray = await this.kakaoService.getKakaoEvents(kakaoUser);

        const isValid = await this.kakaoService.verifyKakaoToken(kakaoUser);

        if(isValid) {
            await this.socialEventService.deleteAll('kakao')
    
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
}