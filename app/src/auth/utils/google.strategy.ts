import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: 'clientId',
            clientSecret: 'clientSecret',
            callbackURL: 'callback URL',
            scope: ['profile', 'email'],
            accessType: 'offline',
            prompt: 'consent',
        });
    }

    async validate (accessToken: string, refreshToken: string, profile: Profile) {
        const { id, displayName, emails } = profile;

        return {
            provider: profile.provider,
            providerId: id,
            name: displayName,
            email: emails[0].value,
            accessToken,
            refreshToken,
        }
    }
}