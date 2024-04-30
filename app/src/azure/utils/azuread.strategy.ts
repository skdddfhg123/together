import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-azure-ad-oauth2';

@Injectable()
export class AzureAdStrategy extends PassportStrategy(Strategy, 'AzureAD') {
    constructor() {
        super({
            clientID: '{YOUR_CLIENT_ID}',
            clientSecret: '{YOUR_CLIENT_SECRET}',
            callbackURL: 'https://www.example.net/auth/azureadoauth2/callback',
            resource: '00000002-0000-0000-c000-000000000000',
            tenant: 'contoso.onmicrosoft.com'
        });
    }

    async validate(accessToken: string, refreshToken: string, response: any, done: Function): Promise<any> {
        console.log(accessToken)
        console.log(refreshToken)
        console.log(response.profile)

        try {
            const { oid, upn, displayName } = response.claims;
            const user = {
                id: oid,
                email: upn,
                name: displayName
            };
            done(null, user);
        } catch (err) {
            done(err, false);
        }
    }
}
