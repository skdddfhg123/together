import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-kakao";

export class KakaoStrategy extends PassportStrategy(Strategy, 'kakao') {
    constructor() {
        super({
            clientID: 'REST API Key',
            clientSecret: 'Client Secret Key',
            callbackURL: 'Redirect URL',
            scope: ['profile_nickname', 'account_email', 'talk_calendar', 'talk_calendar_task'],
        })
    }

    async validate(accessToken: string, refreshToken: string, profile: any) {
        // console.log('accessToken: ' + accessToken);
        // console.log('refreshToken: ' + refreshToken);
        // console.log('user.profile info: ' + profile.data)

        return {
            name: profile.displayName,
            email: profile._json.kakao_account.email,
            password: profile.id,
            accessToken,
            refreshToken,
        }
    }
}