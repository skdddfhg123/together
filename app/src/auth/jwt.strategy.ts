import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { UserCalendar } from "src/db/user_calendar/entities/userCalendar.entity";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(ConfigService)
        private configService: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(payload: { nickname: string; useremail: string, userCalendarId: string }) {
        return { 
            nickname: payload.nickname, 
            useremail: payload.useremail, 
            userCalendarId: payload.userCalendarId 
        };
    }
}
 