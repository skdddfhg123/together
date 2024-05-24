import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor() {
        super({
            clientID: process.env.KAKAO_CLIENT_REST_KEY,
            clientSecret: process.env.KAKAO_CLIENT_SECRET,
            callbackURL: 'http://localhost:3000/kakao/redirect',
            scope: ['profile_nickname', 'account_email', 'talk_calendar', 'talk_calendar_task'],
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {

        return {
            provider: profile.provider,
            accessToken,
            refreshToken,
        }
    }
}