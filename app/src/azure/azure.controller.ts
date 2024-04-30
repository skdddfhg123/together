import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('azure')
export class AzureController {
    @Get('login')
    @UseGuards(AuthGuard('AzureAD'))
    async login(@Req() req) {
        // Initiates the OAuth2 login flow
    }

    @Get('redirect')
    @UseGuards(AuthGuard('AzureAD'))
    async callback(@Req() req) {
        // Handles the OAuth2 callback from the identity provider
        console.log(req.user);  // User object set by validate method in strategy
        return req.user;
    }
}
