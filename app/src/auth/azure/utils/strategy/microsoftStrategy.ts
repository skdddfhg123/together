import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from 'passport-microsoft';

export class MicrosoftStrategy extends PassportStrategy(Strategy, 'azure') {
    constructor() {
        super({
            clientID: '65414a67-5b95-4220-a531-5f3a9e8e11ed',
            clientSecret: 'xB8Q~jUAPxHjkcp~wJZROKI-.YHfCkKT0b5ia9_',
            callbackURL: "http://localhost:3000/azure/redirect",
            scope: ['User.Read.All', 'Calendars.Read', 'Calendars.ReadWrite'],
            tenant: 'b1b9b246-22b0-47ab-ab54-32487ccc176b',
            authorizationURL: 'https://login.microsoftonline.com/b1b9b246-22b0-47ab-ab54-32487ccc176b/oauth2/v2.0/authorize',
            tokenURL: 'https://login.microsoftonline.com/b1b9b246-22b0-47ab-ab54-32487ccc176b/oauth2/v2.0/token',
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {

        console.log(accessToken)
        console.log(refreshToken)
        console.log(profile);

        return {
            provider: profile.provider,
            accessToken,
            refreshToken,
        }
    }
}