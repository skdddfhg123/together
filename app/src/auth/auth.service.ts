import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/db/user/user.service';
import { LoginDTO } from './dtos/login.dto';
import * as bcrypt from "bcryptjs";
import { UserCalendarService } from 'src/db/user_calendar/userCalendar.service';
import { TokensService } from 'src/db/tokens/tokens.service';
import { User } from 'src/db/user/entities/user.entity';
import { Repository, createQueryBuilder } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { PayloadResponse } from './dtos/payload-response';
import { UserCalendar } from 'src/db/user_calendar/entities/userCalendar.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserCalendar)
        private readonly userCalendarRepository: Repository<UserCalendar>,
        private userService: UserService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private userCalendarService: UserCalendarService,
        private tokensService: TokensService,
    ) { }

    getEnvVariables() {
        return {
            port: this.configService.get<number>("port"),
        };
    }

    async login(loginDTO: LoginDTO): Promise<{ accessToken: string, refreshToken: string }> {
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

            const accessToken = this.jwtService.sign(payload, { expiresIn: '1h' });
            const refreshToken = this.jwtService.sign(payload, { expiresIn: '60d' });

            await this.tokensService.saveUserToken(user.useremail, 'jwt', accessToken, refreshToken);

            return {
                accessToken,
                refreshToken
            };
        } else {
            throw new UnauthorizedException("Password does not match");
        }
    }

    async GetAllByToken(payload: PayloadResponse): Promise<any> {

        const result = await this.userRepository.createQueryBuilder("user")
            .select([
                "user.useremail",
                "user.phone",
                "user.nickname",
                "user.thumbnail",
                "user.registeredAt",
                "user.updatedAt",
                "user.birthDay",
            ])
            .leftJoinAndSelect("user.userCalendarId", "userCalendar")
            .leftJoin("userCalendar.groupCalendar", "calendar")
            .addSelect([
                "calendar.calendarId",
                "calendar.title",
                "calendar.coverImage",
                "calendar.bannerImage",
                "calendar.type",
                "calendar.attendees",
                "calendar.author",
            ])
            .leftJoinAndSelect("calendar.groupEvents", "groupEvent")
            .leftJoinAndSelect("userCalendar.socialEvents", "socialEvent")
            .where("user.useremail = :useremail", { useremail: payload.useremail })
            .getMany();

        if (!result || result.length === 0) {
            throw new UnauthorizedException("User not found");
        }

        return result;
    }

    async GetAllByUserCalendarId(userCalendarId: string): Promise<any> {
        const result = await this.userCalendarRepository.createQueryBuilder("userCalendar")
            .leftJoinAndSelect("userCalendar.user", "user")
            .select([
                "user.useremail",
                "user.nickname",
            ])
            .addSelect([
                "userCalendar.userCalendarId"
            ])
            .leftJoinAndSelect("userCalendar.groupCalendar", "calendar")
            .leftJoinAndSelect("calendar.groupEvents", "groupEvent")
            .leftJoinAndSelect("userCalendar.socialEvents", "socialEvent")
            .where("userCalendar.userCalendarId = :userCalendarId", { userCalendarId })
            .getMany();

        if (!result || result.length === 0) {
            throw new UnauthorizedException("UserCalendar not found");
        }

        return result;
    }
}
