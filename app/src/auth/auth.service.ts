import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
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
import { Calendar } from 'src/calendar/entities/calendar.entity';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(UserCalendar)
        private readonly userCalendarRepository: Repository<UserCalendar>,
        @InjectRepository(Calendar)
        private readonly calendarRepository: Repository<Calendar>,
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
        try {
            const user = await this.userService.findOne(loginDTO);

            if (!user) {
                throw new UnauthorizedException("User not found");
            }

            const passwordMatched = await bcrypt.compare(loginDTO.password, user.password);

            if (!passwordMatched) {
                throw new UnauthorizedException("Password does not match");
            }

            // userCalendar 정보를 가져오는 로직 추가 (가정)
            const userCalendar = await this.userCalendarService.findCalendarByUserId(user.userId);

            const payload = {
                nickname: user.nickname,
                useremail: user.useremail,
                userCalendarId: userCalendar?.userCalendarId,
            };

            const accessToken = this.jwtService.sign(payload, { expiresIn: '3d' });
            const refreshToken = this.jwtService.sign(payload, { expiresIn: '60d' });

            await this.tokensService.saveUserToken(user.useremail, 'jwt', accessToken, refreshToken);

            return {
                accessToken,
                refreshToken,
            };

        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            } else {
                throw new InternalServerErrorException("An error occurred during login");
            }
        }
    }

    async login2(loginDTO: LoginDTO): Promise<any> {
        try {
            const user = await this.userService.findOne(loginDTO);

            if (!user) {
                throw new UnauthorizedException("User not found");
            }

            const passwordMatched = await bcrypt.compare(loginDTO.password, user.password);

            if (!passwordMatched) {
                throw new UnauthorizedException("Password does not match");
            }

            // userCalendar 정보를 가져오는 로직 추가 (가정)
            const userCalendar = await this.userCalendarService.findCalendarByUserId(user.userId);

            const payload = {
                nickname: user.nickname,
                useremail: user.useremail,
                userCalendarId: userCalendar?.userCalendarId,
            };

            const accessToken = this.jwtService.sign(payload, { expiresIn: '3d' });
            const refreshToken = this.jwtService.sign(payload, { expiresIn: '60d' });

            await this.tokensService.saveUserToken(user.useremail, 'jwt', accessToken, refreshToken);

            return {
                accessToken,
                refreshToken,
                "nickname": user.nickname,
                "useremail": user.useremail,
                "userCalendarId": userCalendar.userCalendarId,
            };

        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            } else {
                throw new InternalServerErrorException("An error occurred during login");
            }
        }
    }

    async GetAllByToken(payload: PayloadResponse): Promise<any> {
        try {
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

        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            } else {
                throw new InternalServerErrorException("An error occurred while fetching user data");
            }
        }
    }

    async GetAllByToken2(payload: PayloadResponse): Promise<any> {
        try {
            // 유저 및 유저 캘린더 정보 가져오기
            const userWithCalendar = await this.userRepository.createQueryBuilder("user")
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
                .leftJoinAndSelect("userCalendar.socialEvents", "socialEvent")
                .where("user.useremail = :useremail", { useremail: payload.useremail })
                .getOne();

            if (!userWithCalendar) {
                throw new UnauthorizedException("User not found");
            }

            // 유저 캘린더에서 groupCalendar 배열을 사용하여 모든 캘린더 정보 가져오기
            const calendars = await this.calendarRepository.createQueryBuilder("calendar")
                .leftJoinAndSelect("calendar.groupEvents", "groupEvent")
                .where("calendar.calendarId IN (:...calendarIds)", { calendarIds: userWithCalendar.userCalendarId.groupCalendars })
                .getMany();

            console.log(`calendars: ${calendars}\nuserWithCalendar: ${userWithCalendar}`);

            return {
                user: userWithCalendar,
                calendars
            };

        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            } else {
                console.error('Error fetching data:', error);
                throw new InternalServerErrorException("An error occurred while fetching user data");
            }
        }
    }

    async GetAllByUserCalendarId(userCalendarId: string): Promise<any> {
        try {
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

        } catch (error) {
            if (error instanceof UnauthorizedException) {
                throw error;
            } else {
                throw new InternalServerErrorException("An error occurred while fetching user calendar data");
            }
        }
    }

    async GetAllEventByCalendarId(calendarId: string, currentDate: Date): Promise<any> {
        try {
            const calendar = await this.calendarRepository.findOne({
                where: { calendarId },
                select: ['attendees']
            });

            if (!calendar) {
                throw new NotFoundException("Calendar not found");
            }

            if (!calendar.attendees.length) {
                throw new NotFoundException("No attendees found for this calendar");
            }

            const twoMonthsAgo = new Date(currentDate);
            twoMonthsAgo.setMonth(currentDate.getMonth() - 2);
            const twoMonthsLater = new Date(currentDate);
            twoMonthsLater.setMonth(currentDate.getMonth() + 2);

            const userCalendars = await this.userCalendarRepository.createQueryBuilder("userCalendar")
                .leftJoinAndSelect("userCalendar.socialEvents", "socialEvent")
                .leftJoinAndSelect("userCalendar.user", "user")
                .select([
                    "userCalendar.userCalendarId",
                    "user.useremail",
                    "user.nickname",
                    "user.thumbnail",
                    "userCalendar.groupCalendars"
                ])
                .where("userCalendar.userCalendarId IN (:...ids)", { ids: calendar.attendees })
                .getMany();

            if (!userCalendars.length) {
                throw new NotFoundException("UserCalendar details not found for attendees");
            }

            const calendarsData = await Promise.all(userCalendars.map(async userCalendar => {
                const calendars = await this.calendarRepository.createQueryBuilder("calendar")
                    .leftJoinAndSelect("calendar.groupEvents", "groupEvent")
                    .select([
                        "calendar.title",
                        "calendar.type",
                        "groupEvent.title",
                        "groupEvent.startAt",
                        "groupEvent.endAt",
                    ])
                    .where("calendar.calendarId IN (:...calendarIds)", { calendarIds: userCalendar.groupCalendars })
                    .andWhere("calendar.calendarId != :originalCalendarId", { originalCalendarId: calendarId })
                    .andWhere("groupEvent.startAt BETWEEN :twoMonthsAgo AND :twoMonthsLater", { twoMonthsAgo, twoMonthsLater })
                    .andWhere(":userEmail = ANY(string_to_array(groupEvent.member, ','))", { userEmail: userCalendar.user.useremail })
                    .getMany();

                return {
                    userCalendar: userCalendar,
                    calendars: calendars.map(calendar => ({
                        title: calendar.title,
                        type: calendar.type,
                        groupEvents: calendar.groupEvents.map(ge => ({
                            title: ge.title,
                            startAt: ge.startAt,
                            endAt: ge.endAt
                        }))
                    }))
                };
            }));

            return calendarsData;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw new InternalServerErrorException("An error occurred while fetching user calendar data");
        }
    }

}
