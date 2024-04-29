import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { Repository } from "typeorm";
import { InjectRepository } from "@nestjs/typeorm";
import * as config from 'config';
import { User } from "src/user/user.entity";

@Injectable()

export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(
        @ InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {
        super({
            secretOrKey: process.env.JWT_SECRET || config.get('jwt.secret'),
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
        })
    }

    async validate(payload) {
        const { userid } = payload;
        const user : User = await this.userRepository.findOne({ where : {userId : userid}});

        if(!user) {
            throw new UnauthorizedException();
        }

        return user;
    }

}