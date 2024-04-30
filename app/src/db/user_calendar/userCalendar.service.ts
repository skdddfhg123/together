import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { UserCalendar } from "./entities/userCalendar.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { SocialEvent } from "./entities/socialEvent.entity";
import { SocialEventDto } from "./dtos/socialEvent.dto";
import { UserService } from "../user/user.service";

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
            if(calendar.title != null){
                socialCalendar.title = calendar.title;
            }
            socialCalendar.social = calendar.social;
            socialCalendar.userCalendar = calendarInfo;
        
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