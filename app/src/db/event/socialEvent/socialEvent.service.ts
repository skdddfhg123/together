import { Injectable, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { SocialEvent } from "./entities/socialEvent.entity";
import { Repository } from "typeorm";
import { SocialEventDto } from "./dtos/socialEvent.dto";
import { UserService } from "src/db/user/user.service";
import { UserCalendarService } from "src/db/user_calendar/userCalendar.service";

@Injectable()
export class SocialEventService {

    constructor(
        @InjectRepository(SocialEvent)
        private socialEventRepository: Repository<SocialEvent>,

        private userService: UserService,
        private userCalendarService: UserCalendarService,
    ) {}

    /** API에서 불러온 캘린더 일정 저장 */
    async saveSocialCalendar(calendar: SocialEventDto, userCalenderId: string): Promise<SocialEvent> {
        try{
            const calendarInfo = await this.userCalendarService.findUserCalendarById(userCalenderId)
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
    
    /** userCalendar를 통한 특정 소셜 이벤트 지우기 */
    async deleteSocialEvents(socialName: string, userCalendarId: string): Promise<void> {
        try {
            const userCalendar = await this.userCalendarService.findUserCalendarById(userCalendarId)
            if(userCalendar) {
                await this.socialEventRepository.delete({social: socialName, userCalendar: userCalendar})
            }
        }
        catch(err){
            console.log(err)
        }
    }

    /** userCalendar를 통한 특정 소셜 찾기 */
    async findSocialEventsByUserCalendarId(provider: string, userCalendarId: string): Promise<SocialEvent[]> {
        try {
            const userCalendar = await this.userCalendarService.findUserCalendarById(userCalendarId)
            if(userCalendar) {
                return await this.socialEventRepository.findBy({social: provider, userCalendar: userCalendar})
            }
        }
        catch(err) {
            console.log(err)
        }
    }
}