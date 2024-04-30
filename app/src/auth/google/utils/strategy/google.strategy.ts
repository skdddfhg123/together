import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Profile, Strategy } from 'passport-google-oauth20'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/google/redirect',
            scope: ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
            // accessType: 'offline',
            // prompt: 'consent',
        });
    }

    async validate (accessToken: string, refreshToken: string, profile: Profile) {
        // console.log("profile in strategy: " + profile);

        return {
            provider: profile.provider,
            accessToken,
            refreshToken,
        }
    }
}