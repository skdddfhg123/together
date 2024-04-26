import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: '772240998393-tb8vbgp0disiu22sfokdej2dpu103cs3.apps.googleusercontent.com',
            clientSecret: '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',
            callbackURL: 'http://localhost:3000/auth/google/redirect',
            scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
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