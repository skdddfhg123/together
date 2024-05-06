import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateGroupEventDTO } from "./dtos/groupEvent.create.dto";
import { PayloadResponse } from "src/auth/dtos/payload-response";
import { UserService } from "src/db/user/user.service";
import { GroupEvent } from "./entities/groupEvent.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { CalendarService } from "src/calendar/calendar.service";
import { UserCalendarService } from "src/db/user_calendar/userCalendar.service";
import { Calendar } from "src/calendar/entities/calendar.entity";
// import { InjectRepository } from "@nestjs/typeorm";
// import { Repository } from "typeorm";
// import { GroupEvent } from "./entities/groupEvent.entity";
// import { User } from "src/db/user/entities/user.entity";
// import { JwtService } from "@nestjs/jwt";
// import { UserCalendar } from "src/db/user_calendar/entities/userCalendar.entity";
// import { UserService } from "src/db/user/user.service";
// import { UserCalendarService } from "src/db/user_calendar/userCalendar.service";


@Injectable()
export class GroupEventService {
    constructor (
        @ InjectRepository(GroupEvent)
        private readonly groupEventRepository: Repository<GroupEvent>,
        @ InjectRepository(Calendar)
        private readonly calendarRepository: Repository<Calendar>,
        // private userService: UserService,
        // private calendarService: CalendarService,
        // private userCalendarService: UserCalendarService,
    ) {}

    async createGroupEvent(
        userCreateGroupEventDTO: CreateGroupEventDTO,
        payload: PayloadResponse,
        calendarId: string
    ): Promise<GroupEvent> {
        const calendar = await this.calendarRepository.findOneBy({ calendarId: calendarId });
        if (!calendar) {
            throw new NotFoundException('Calendar not found');
        }
        if (!calendar.attendees.includes(payload.userCalendarId)) {
            throw new ForbiddenException('You do not have permission to add an event to this calendar');
        }

        const groupEvent = new GroupEvent();
        groupEvent.author = payload.userCalendarId;
        groupEvent.calendarId = calendarId;
        
        const { title, color, startAt, endAt, emails} = userCreateGroupEventDTO;
        groupEvent.title = title;
        groupEvent.color = color;
        groupEvent.startAt = startAt;
        groupEvent.endAt = endAt;
        groupEvent.member = emails;

        try {
            const savedGroupEventEvent = await this.groupEventRepository.save(groupEvent);
            return savedGroupEventEvent;
        } catch (e) {
            console.error('Error saving group calendar:', e);
            throw new InternalServerErrorException('Error saving group event');
        }
    
    }

    async getAllGroupEventsByCalendarId(calendarId: string): Promise<GroupEvent[]> {
        try {
            const groupEvents = await this.groupEventRepository.find({
                where: {
                calendarId: calendarId,
                isDeleted: false
                },
                order: {
                    startAt: 'ASC'
                }
            });
            return groupEvents;
        } 
        catch (e) {
          throw new InternalServerErrorException(`Failed to fetch group events for calendar ID ${calendarId}`);
        }
    }


     async getGroupEvent( groupEventId : string ): Promise<GroupEvent> {
    
        // null : member, alerts, attetchment
        // auto : groupEventId, pinned, createdAt, updatedAt, deactivatedAt
        // relation : calendarId
        // token : author
        // dto : group, title, color, startAt, endAt, 
    
            try {
            
            const groupEvent = await this.groupEventRepository.findOne({
                where: { groupEventId: groupEventId, isDeleted : false 
                 },
                
            });

            if (!groupEvent) {
                throw new Error('Group event not found');
            }
            return groupEvent;


        } catch (e) {
            console.error('Error occurred:', e);
            throw new InternalServerErrorException('Failed to deactivate group event');
        }
     }

    async getGroupEventUpdateForm(groupEventId: string): Promise<GroupEvent> {
        try {
            // 해당 ID의 GroupEvent를 찾습니다.
            const groupEventToUpdate = await this.groupEventRepository.findOne({ where: { groupEventId: groupEventId } });

            if (!groupEventToUpdate) {
                throw new Error('Group event not found');
            }
            return groupEventToUpdate;
        } catch (e) {
            throw new InternalServerErrorException('Failed to modify group event');
        }
    }

    async updateGroupEvent(groupEventId: string, updateData: Partial<GroupEvent>): Promise<GroupEvent> {
        try {
            // 해당 ID의 GroupEvent를 찾습니다.
            const groupEventToUpdate = await this.groupEventRepository.findOne({ where: { groupEventId } });
    
            if (!groupEventToUpdate) {
                throw new NotFoundException('Group event not found');
            }
    
            // 찾은 GroupEvent의 속성을 업데이트합니다.
            const updatedGroupEvent = this.groupEventRepository.merge(groupEventToUpdate, updateData);
            updatedGroupEvent.updatedAt = new Date();  // 갱신 시간 업데이트
            // 변경된 GroupEvent를 저장합니다.
            return await this.groupEventRepository.save(updatedGroupEvent);
        } catch (e) {
            console.error('Error occurred while updating the group event:', e);
            throw new InternalServerErrorException('Failed to modify group event');
        }
    }
    



    // 그룹 이벤트 삭제
    async removeGroupEvent(groupEventId: string): Promise<GroupEvent> {
        try {
            const groupEvent = await this.groupEventRepository.findOne({
                where: { groupEventId },
            });
    
            if (!groupEvent) {
                throw new NotFoundException('Group event not found');
            }
    
            if (groupEvent.isDeleted) {
                throw new Error('Group event is already marked as deleted');
            }
    
            groupEvent.isDeleted = true;
            groupEvent.deletedAt = new Date();  // 설정 삭제 시간
    
            const updatedGroupEvent = await this.groupEventRepository.save(groupEvent);
            return updatedGroupEvent;
        } catch (e) {
            console.error('Error occurred:', e);
            throw new InternalServerErrorException('Failed to mark group event as deleted');
        }
    }
    

    // find
    // async getGroupEvent( groupEventId : string, ): Promise<getGroupEventDTO> {
    //     try {
    //         // 기존의 GroupEvent 레코드를 조회합니다.
    //         const groupEvent = await this.groupEventRepository.findOne({
    //             where: { groupEventId: groupEventId },
    //         });

    //         if (!groupEvent) {
    //             throw new Error('Group event not found');
    //         }
    //         return groupEvent;


    //     } catch (e) {
    //         console.error('Error occurred:', e);
    //         throw new InternalServerErrorException('Failed to deactivate group event');
    //     }
    // }

    
    async findOne(data: Partial<GroupEvent>): Promise<GroupEvent> {
        // console.log(data)
        const groupEvent = await this.groupEventRepository.findOneBy({ groupEventId: data.groupEventId });
        // console.log(user)
        if (!groupEvent) {
            throw new UnauthorizedException('Could not find group event');
        }
        return groupEvent;
    }

}

