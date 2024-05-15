import { Inject, Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { ConfigService } from "@nestjs/config";
import { Request } from 'express';
import { TokensService } from "src/db/tokens/tokens.service";

@Injectable()
export class JWTStrategy extends PassportStrategy(Strategy) {
    constructor(
        @Inject(ConfigService)
        private configService: ConfigService,
        private readonly tokensService: TokensService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            passReqToCallback: true,
            secretOrKey: configService.get<string>('JWT_SECRET'),
        });
    }

    async validate(request: Request, payload: { nickname: string; useremail: string, userCalendarId: string, isFirst: boolean }) {
        const accessToken = request.headers.authorization;

        const isMatch = await this.tokensService.accessTokenMatches(accessToken, payload);

        if(!isMatch){
            return '재로그인 필요'
        }

        return { 
            nickname: payload.nickname, 
            useremail: payload.useremail, 
            userCalendarId: payload.userCalendarId,
            isFirst: payload.isFirst
        };
    }
}
 