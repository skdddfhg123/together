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

    async GetAllByTokenV2(payload: PayloadResponse): Promise<any> {
        try {
            const userWithCalendar = await this.userRepository.createQueryBuilder("user")
                .select([
                    "user.nickname",
                    "user.useremail",
                    "user.phone",
                    "user.thumbnail",
                    "user.birthDay",
                ])
                .leftJoinAndSelect("user.userCalendarId", "userCalendar")
                .leftJoinAndSelect("userCalendar.socialEvents", "socialEvents")  // 이 부분을 추가
                .where("user.useremail = :useremail", { useremail: payload.useremail })
                .getOne();

            console.log(userWithCalendar);

            if (!userWithCalendar || !userWithCalendar.userCalendarId) {
                throw new NotFoundException("User or user calendar not found");
            }


            const today = new Date();
            const fortyFiveDaysAgo = new Date(today.setDate(today.getDate() - 45));
            const fortyFiveDaysLater = new Date(today.setDate(today.getDate() + 45));

            console.log(userWithCalendar.userCalendarId);

            const [calendars, socialEvents] = await Promise.all([
                this.getGroupEvents(userWithCalendar.userCalendarId.groupCalendars || [], userWithCalendar.useremail, fortyFiveDaysAgo, fortyFiveDaysLater),
                this.getSocialEvents(userWithCalendar.userCalendarId.socialEvents || [], fortyFiveDaysAgo, fortyFiveDaysLater)
            ]);

            return {
                user: {
                    nickname: userWithCalendar.nickname,
                    useremail: userWithCalendar.useremail,
                    phone: userWithCalendar.phone,
                    thumbnail: userWithCalendar.thumbnail,
                    birthDay: userWithCalendar.birthDay
                },
                events: [
                    ...calendars,
                    ...socialEvents
                ]
            };

        } catch (error) {
            console.error('Error fetching data:', error);
            throw new InternalServerErrorException("An error occurred while fetching user data");
        }
    }

    private async getGroupEvents(groupCalendarIds, useremail, startDate, endDate) {
        if (!groupCalendarIds.length) return [];

        // console.log(groupCalendarIds);
        // 먼저 캘린더를 ID 배열로 조회
        const calendars = await this.calendarRepository.createQueryBuilder("calendar")
            .leftJoin("calendar.groupEvents", "groupEvent")
            .select([
                "calendar.calendarId",
                "calendar.title",
                "calendar.type",
                "groupEvent.groupEventId",
                "groupEvent.title",
                "groupEvent.startAt",
                "groupEvent.endAt",
            ])
            .where("calendar.calendarId IN (:...calendarIds) AND calendar.isDeleted = false", { calendarIds: groupCalendarIds })
            .andWhere("groupEvent.isDeleted = false")
            .andWhere(":userEmail = ANY(string_to_array(groupEvent.member, ','))", { userEmail: useremail })
            .andWhere("groupEvent.startAt BETWEEN :startDate AND :endDate", { startDate, endDate })
            .getMany();

        console.log(calendars);
        const events = calendars.flatMap(calendar => calendar.groupEvents.map(event => ({
            id: event.groupEventId,
            group: calendar.title,
            type: calendar.type,
            title: event.title,
            startAt: event.startAt,
            endAt: event.endAt,
        })));
        // console.log(events);


        return events;
    }

    private async getSocialEvents(socialEvents, startDate, endDate) {
        if (!socialEvents.length) return [];
        return socialEvents.filter(event =>
            event.startAt >= startDate && event.endAt <= endDate
        ).map(event => ({
            id: event.socialEventId,
            title: event.title,
            social: event.social,
            startAt: event.startAt,
            endAt: event.endAt
        }));
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

            const fortyFiveDaysAgo = new Date(currentDate);
            fortyFiveDaysAgo.setDate(currentDate.getDate() - 45);
            const fortyFiveDaysLater = new Date(currentDate);
            fortyFiveDaysLater.setDate(currentDate.getDate() + 45);

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
                    .andWhere("groupEvent.startAt BETWEEN :fortyFiveDaysAgo AND :fortyFiveDaysLater", { fortyFiveDaysAgo, fortyFiveDaysLater })
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

    async GetAllEventByCalendarIdV2(calendarId: string, currentDate: Date): Promise<any> {
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

            const fortyFiveDaysAgo = new Date(currentDate);
            fortyFiveDaysAgo.setDate(currentDate.getDate() - 45);
            const fortyFiveDaysLater = new Date(currentDate);
            fortyFiveDaysLater.setDate(currentDate.getDate() + 45);

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

            console.log(`GetAllEventByCalendarId\n\n[calendar]\n${JSON.stringify(calendar)}\n[userCalendars]\n${JSON.stringify(userCalendars)}`);

            const results = await Promise.all(userCalendars.map(async userCalendar => {
                const socialEvents = Array.isArray(userCalendar.socialEvents) ? userCalendar.socialEvents.map(se => ({
                    title: se.title,
                    social: se.social,
                    startAt: se.startAt,
                    endAt: se.endAt
                })) : [];

                // groupCalendars 배열 확인
                if (!userCalendar.groupCalendars || userCalendar.groupCalendars.length === 0) {
                    return {
                        useremail: userCalendar.user.useremail,
                        nickname: userCalendar.user.nickname,
                        allevents: [...socialEvents]
                    };
                }

                let query = this.calendarRepository.createQueryBuilder("calendar")
                    .leftJoinAndSelect("calendar.groupEvents", "groupEvent")
                    .select([
                        "calendar.title",
                        "calendar.type",
                        "groupEvent.title",
                        "groupEvent.startAt",
                        "groupEvent.endAt",
                    ])
                    .where("calendar.calendarId IN (:...calendarIds)", { calendarIds: userCalendar.groupCalendars })
                    .andWhere(":userEmail = ANY(string_to_array(groupEvent.member, ','))", { userEmail: userCalendar.user.useremail })
                    .andWhere("calendar.calendarId != :calendarId", { calendarId })
                    .andWhere("groupEvent.startAt BETWEEN :startDate AND :endDate", {
                        startDate: fortyFiveDaysAgo,
                        endDate: fortyFiveDaysLater
                    });


                const calendars = await query.getMany();

                const allGroupEvents = calendars.flatMap(calendar =>
                    calendar.groupEvents.map(ge => ({
                        title: ge.title,
                        startAt: ge.startAt,
                        endAt: ge.endAt
                    }))
                );

                return {
                    useremail: userCalendar.user.useremail,
                    nickname: userCalendar.user.nickname,
                    allevents: [...allGroupEvents, ...socialEvents]
                };
            }));

            return results;
        } catch (error) {
            console.error('Error fetching data:', error);
            throw new InternalServerErrorException("An error occurred while fetching user calendar data");
        }
    }

}
