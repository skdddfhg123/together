import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService, GoogleUser, JwtPayload } from './auth.service';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Get('google')
    @UseGuards(AuthGuard('google'))
    async logInGoogleAuth(): Promise<void> {}

    @Get('google/redirect')
    @UseGuards(AuthGuard('google'))
    async googleAuthCallback(@Req() req, @Res() res: Response): Promise<void> {
        const user = await this.authService.findByProviderIdOrSave(req.user as GoogleUser);

        const google_user = req.user as GoogleUser

        // console.log("google provider: " + google_user.provider)
        // console.log("google providerId: " + google_user.providerId)
        // console.log("google name: " + google_user.name)
        // console.log("google access token: " + google_user.accessToken)
        console.log("google refresh token: " + google_user.refreshToken)

        const payload: JwtPayload = { sub: user.providerId, email: user.email };

        const { accessToken, refreshToken } = await this.authService.getToken(payload);

        console.log("jwt refresh token: " + accessToken)

        res.cookie('access-token', google_user.accessToken);
        res.cookie('refresh-token', refreshToken);

        return await this.authService.fetchCalendarEvents(google_user.accessToken)
    }
}
