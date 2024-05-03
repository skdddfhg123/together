import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/db/user/user.service';
import { LoginDTO } from './dtos/login.dto';
import * as bcrypt from "bcryptjs";
import { UserCalendarService } from 'src/db/user_calendar/userCalendar.service';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private userCalendarService: UserCalendarService,
    ) { }

    getEnvVariables() {
        return {
            port: this.configService.get<number>("port"),
        };
    }

    async login(loginDTO: LoginDTO): Promise<{ accessToken: string }> {
        const user = await this.userService.findOne(loginDTO);
        
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
    
        const passwordMatched = await bcrypt.compare(loginDTO.password, user.password);
    
        if (passwordMatched) {
            // userCalendar 정보를 가져오는 로직 추가 (가정)
            const userCalendar = await this.userCalendarService.findCalendarByUserId(user.userId);

            const payload = {
                nickname: user.nickname,
                useremail: user.useremail,
                userCalendarId: userCalendar?.userCalendarId
            };
            console.log(payload);
            return { accessToken: this.jwtService.sign(payload) };
        } else {
            throw new UnauthorizedException("Password does not match");
        }
    }
}
