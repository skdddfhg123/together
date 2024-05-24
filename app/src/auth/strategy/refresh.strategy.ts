import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import { TokensService } from 'src/db/tokens/tokens.service';
import { PayloadResponse } from '../dtos/payload-response';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class RefreshStrategy extends PassportStrategy(Strategy, 'jwt-refresh-token') {
  constructor(
    private readonly configService: ConfigService,
    private readonly tokensService: TokensService,
    private readonly jwtService: JwtService,
  ) {
    super({
        jwtFromRequest: ExtractJwt.fromExtractors([(request: Request) => {
            return request?.cookies?.refreshToken
        }]),
      ignoreExpiration: false,
      passReqToCallback: true,
      algorithms: ['HS256'],
      secretOrKey: configService.get('JWT_SECRET'),
    });
  }

  async validate(request: Request, payload: PayloadResponse) {    
    const refreshToken = request.cookies['refreshToken'];
    
    const isMatch = await this.tokensService.refreshTokenMatches(refreshToken, payload);

    if(!isMatch) {
        return '재로그인 필요'
    }

    return {
        nickname: payload.nickname,
        useremail: payload.useremail,
        userCalendarId: payload.userCalendarId,
    };
  }
}