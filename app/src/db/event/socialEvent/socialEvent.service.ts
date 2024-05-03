import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SocialEvent } from "./entities/socialEvent.entity";
import { Repository } from "typeorm";
import { SocialEventDto } from "./dtos/socialEvent.dto";
import { UserCalendarService } from "src/db/user_calendar/userCalendar.service";

@Injectable()
export class SocialEventService {

    constructor(
        @InjectRepository(SocialEvent)
        private socialEventRepository: Repository<SocialEvent>,
        private userCalendarService: UserCalendarService,
    ) {}

    async saveSocialCalendar(calendar: SocialEventDto, userCalenderId: string): Promise<SocialEvent> {
        try{
            // const tempUID = '5fcb0643-5458-406e-bf42-cbcf4603a61d';
            // const userInfo = await this.userService.findOne({userId: tempUID});
            const calendarInfo = await this.userCalendarService.findCalendarByUserCalendarId(userCalenderId)
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
            if(err.code === '23505') {
                return null;
            }
        }
    }
    
    async deleteAll(socialName: string): Promise<boolean> {
        try {
            await this.socialEventRepository.delete({social: socialName})
            return true;
        }
        catch(err){
            return false;
        }
    }
}