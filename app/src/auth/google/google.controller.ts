import { Controller, Get, HttpStatus, Req, Res, UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Response } from 'express';
import { GoogleService } from './google.service';
import { GoogleUser } from './utils/interface/google.interface';
import { UserCalendarService } from 'src/db/user_calendar/userCalendar.service';
import { ApiTags } from '@nestjs/swagger';
import { SocialEventDto } from 'src/db/user_calendar/dtos/socialEvent.dto';
import { GetUser } from 'src/db/user/getUser.decorator';
import { JwtAuthGuard } from '../jwt.guard';
import { UserService } from 'src/db/user/user.service';
import { User } from 'src/db/user/entities/user.entity';

@ApiTags('google')
@Controller('google')
export class GoogleController {
    constructor(
        private googleService: GoogleService,
        private userCalendarService: UserCalendarService,
    ) {}

    @Get('login')
    @UseGuards(AuthGuard('google'))
    async logInGoogleAuth(): Promise<void> {
    }

    @Get('redirect')
    // @UseGuards(JwtAuthGuard)
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Req() req, @Res() res: Response/*, @GetUser() user: User*/): Promise<void> {
        
        const googleUser = req.user as GoogleUser
        
        // const savedUser = await this.googleService.findByProviderIdOrSave(googleUser); // refresh Token bisuness logic

        const isValid = await this.googleService.verifyToken(googleUser.accessToken);

        if(isValid)
        {
            const googleCalendars = await this.googleService.fetchCalendarEvents(googleUser.accessToken);
            // console.log(googleCalendars)
            for (let i = 0; i < googleCalendars.length; i++) {
                const event = googleCalendars[i]
                const socialEvent = new SocialEventDto();
                socialEvent.social = 'google';
                socialEvent.title = event.summary;
                socialEvent.startAt = event.start.date || event.start.dateTime;
                socialEvent.endAt = event.end.date || event.end.dateTime;
                await this.userCalendarService.saveSocialCalendar(socialEvent/*, user*/);
            }
        }
        else
        {
            console.log('invalid token');
            throw new UnauthorizedException('Invalid Access Token');
        }
    }
}