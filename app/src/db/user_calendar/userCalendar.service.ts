import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { UserCalendar } from "./entities/userCalendar.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { Calendar } from "src/calendar/entities/calendar.entity";
import { PayloadResponse } from "src/auth/dtos/payload-response";
import { SocialEvent } from "../event/group_event/entities/socialEvent.entity";
import { SocialEventDto } from "./dtos/socialEvent.dto";

@Injectable()
export class UserCalendarService {
    constructor (
        @ InjectRepository(UserCalendar)
        private readonly userCalendarRepository: Repository<UserCalendar>,
        @InjectRepository(SocialEvent)
        private readonly socialEventRepository: Repository<SocialEvent>,
        private userService: UserService,
    ) {}

    // create (계정 생성 시 불러와질 함수)
    async userCalendarCreate( user : User ): Promise<UserCalendar> {
        const userCalendar = new UserCalendar();
        userCalendar.user = user;
        
        try {
            const savedUserCalendar = await this.userCalendarRepository.save(userCalendar);
            return savedUserCalendar;
        } catch (e) {
            console.error('Error occurred:', e);
            throw new InternalServerErrorException('Failed to create user calendar');
        }
    } 


    // 소셜 event 추가
    async saveSocialCalendar(calendar: SocialEventDto/*, user: User*/): Promise<SocialEvent> {
        try{
            const tempUID = '5fcb0643-5458-406e-bf42-cbcf4603a61d';
            const userInfo = await this.userService.findOne({userId: tempUID});
            const calendarInfo = await this.findOneByUID(userInfo.userId)
            const socialCalendar = new SocialEvent();
            socialCalendar.startAt = calendar.startAt;
            socialCalendar.endAt = calendar.endAt;
            if(calendar.title != null) {
                socialCalendar.title = calendar.title;
            }
            socialCalendar.social = calendar.social;
            socialCalendar.userCalendar = calendarInfo;

            const endTime = new Date(socialCalendar.endAt);
            const curTime = new Date();
            if(endTime < curTime) {
                socialCalendar.deactivatedAt = true;
            }
        
            const savedGoogleUser = await this.socialEventRepository.save(socialCalendar);
            return savedGoogleUser;
        }
        catch(err)
        {
            console.log(err)
        }
    }

    // 그룹 event 추가


    // find
    async findOne(data: Partial<UserCalendar>): Promise<UserCalendar> {
        const user = await this.userCalendarRepository.findOneBy({ userCalendarId: data.userCalendarId });

        if (!user) {
            throw new UnauthorizedException('Could not find user');
        }
        return user;
    }

    async findCalendarByUserId(userId: string): Promise<UserCalendar> {
        try {
            const userCalendar = await this.userCalendarRepository.findOne({
                where: {
                    user: { userId: userId }
                },
                relations: ['user']
            });
        
            if (!userCalendar) {
                throw new UnauthorizedException(`UserCalendar not found for user ID: ${userId}`);
            }
        
            return userCalendar;
        } catch (error) {
            console.error('Error occurred:', error);
            throw new InternalServerErrorException('Failed to find user calendar');
        }
    }

    async findOneByUID(data: string): Promise<UserCalendar> {
        const user = await this.userCalendarRepository.findOne({
            where: {
                user: { userId: data }
            },
            relations: ['user']
        });

        if (!user) {
            throw new UnauthorizedException('Could not find user');
        }
        return user;
    }
}