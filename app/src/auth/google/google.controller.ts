import { Body, Controller, Get, HttpStatus, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GoogleService } from './google.service';
import { GoogleUser } from './utils/interface/google.interface';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
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

    // @Get('login')
    // @UseGuards(AuthGuard('google'))
    // async logInGoogleAuth(): Promise<void> {
    // }

    // @Get('redirect')
    // // @UseGuards(JwtAuthGuard)
    // @UseGuards(AuthGuard('google'))
    // async googleAuthCallback(@Req() req, @Res() res: Response/*, @GetUser() user: User*/): Promise<Array<SocialEvent>> {
        
    //     const googleUser = req.user as GoogleUser
        
    //     // const savedUser = await this.googleService.findByProviderIdOrSave(googleUser); // refresh Token bisuness logic

    //     const isValid = await this.googleService.verifyToken(googleUser.accessToken);

        
    //     if(isValid)
    //     {
    //         const googleCalendars = await this.googleService.fetchCalendarEvents(googleUser.accessToken);

    //         await this.socialEventService.deleteAll('google')
    //         // console.log(googleCalendars)
    //         const savePromises = googleCalendars.map(event => {
    //             const socialEvent = new SocialEventDto();
    //             socialEvent.social = 'google';
    //             socialEvent.title = event.summary;
    //             socialEvent.startAt = event.start.date || event.start.dateTime;
    //             socialEvent.endAt = event.end.date || event.end.dateTime;
    //             const isSaved =  this.socialEventService.saveSocialCalendar(socialEvent/*, user*/);
    //             if(isSaved != null)
    //                 return isSaved
    //         })

    //         const resultArray = await Promise.all(savePromises);

    //         return resultArray;
    //     }
    //     else
    //     {
    //         // console.log('invalid token');
    //         throw new UnauthorizedException('Invalid Access Token');
    //     }
    // }

    @ApiResponse({
        status: 201,
        description: '성공 시 해당 response 반환',
        type: Array<SocialEvent>,
    })
    // @ApiBearerAuth('JWT-auth')
    @Get('calendar')
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

            await this.socialEventService.deleteAll('google')
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
}