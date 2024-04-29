import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { lastValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { UserService } from 'src/user/user.service';
import { LoginDTO } from './dto/login.dto';
import * as bcrypt from "bcryptjs";

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
    ) { }

    getEnvVariables() {
        return {
            port: this.configService.get<number>("port"),
        };
    }

    async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
        // console.log(loginDTO);
        const user = await this.userService.findOne(loginDTO);
        
        if (!user) {
            throw new UnauthorizedException("User not found");
        }

        // console.log(user);

        const passwordMatched = await bcrypt.compare( loginDTO.pwd, user.pwd );

        if (passwordMatched) {
            const payload = { nickname: user.nickname, sub: user.email };
            console.log(payload);
            return {accessToken: this.jwtService.sign(payload)};
        } else {
            throw new UnauthorizedException("Password does not match");
        }
    }
}
