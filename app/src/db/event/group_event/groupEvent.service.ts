import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateGroupEventDTO } from "./dtos/groupEvent.create.dto";
import { PayloadResponse } from "src/auth/dtos/payload-response";
import { UserService } from "src/db/user/user.service";
import { GroupEvent } from "./entities/groupEvent.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Between, Repository } from "typeorm";
import { CalendarService } from "src/calendar/calendar.service";
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
        private userService: UserService,
        private calendarService: CalendarService,
    ) {}

    // create (그룹 이벤트 생성)
    async createGroupEvent( userCreateGroupEventDTO : CreateGroupEventDTO, payload: PayloadResponse, calendarId: string): Promise<GroupEvent> {
        
        // nullable : member, alerts, attetchment
        // auto : groupEventId, pinned, createdAt, updatedAt, deactivatedAt
        // relation : calendarId
        // token : author
        // dto : group, title, color, startAt, endAt, 

        const groupEvent = new GroupEvent();
        // get author by JWT
        const user = await this.userService.findOne({ useremail: payload.useremail })
        if (!user) {
            throw new UnauthorizedException("User not found");
        }
        groupEvent.author = user.userId;
        // get calendarId by relation
        if (!calendarId) {
            throw new NotFoundException('Calendar not found');
        }
        groupEvent.calendarId = calendarId;
        
        // get DTO
        const {group, title, color, startAt, endAt} = userCreateGroupEventDTO;
        groupEvent.groupName = group;
        groupEvent.title = title;
        groupEvent.color = color;
        groupEvent.startAt = startAt;
        groupEvent.endAt = endAt;

        try {
            // console.log(groupEvent);
            const savedGroupEventEvent = await this.groupEventRepository.save(groupEvent);
            // console.log('Saved Group Event:', savedGroupEventEvent);
            return savedGroupEventEvent;
        } catch (e) {
            console.error('Error saving group calendar:', e);
            throw new InternalServerErrorException('Error saving group event');
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
                where: { groupEventId: groupEventId, deactivatedAt : false 
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


     async getGroupEventbyMonth( /*yearmonth : string*/ ): Promise<GroupEvent[]> {
    
        // null : member, alerts, attetchment
        // auto : groupEventId, pinned, createdAt, updatedAt, deactivatedAt
        // relation : calendarId
        // token : author
        // dto : group, title, color, startAt, endAt, 
    
            try {
                /*
                let yearAndMonth = parseInt(yearmonth)
                const year = ( yearAndMonth / 100); 
                const month = (yearAndMonth % 100);
                const firstDayOfMonth = new Date(year, month, 1);
                const lastDayOfMonth = new Date(year, month + 1, 0);
                */
                const groupEvents = await this.groupEventRepository.find({
                    /*
                    where: {
                        startAt: Between(firstDayOfMonth, lastDayOfMonth) 
                    }
                    */
                });
        
                return groupEvents;
            } catch (e) {
                console.error('Error occurred:', e);
                throw new InternalServerErrorException('Failed to fetch group events for the month');
            }
     }



    //그룹 이벤트 수정 get
    async getGroupEventUpdateForm(groupEventId: string): Promise<GroupEvent> {
        try {
            // 해당 ID의 GroupEvent를 찾습니다.
            const groupEventToUpdate = await this.groupEventRepository.findOne({ where: { groupEventId: groupEventId } });

            if (!groupEventToUpdate) {
                throw new Error('Group event not found');
            }

            return groupEventToUpdate;
        } catch (e) {
            console.error('Error occurred:', e);
            throw new InternalServerErrorException('Failed to modify group event');
        }
     }


    
    //그룹 이벤트 수정 
    
    async updateGroupEvent(groupEventId : string, updateData: Partial<GroupEvent>): Promise<GroupEvent> {
        try {
            // 해당 ID의 GroupEvent를 찾습니다.
            const groupEventToUpdate = await this.groupEventRepository.findOne({ where: { groupEventId: updateData.groupEventId }  });

            if (!groupEventToUpdate) {
                throw new Error('Group event not found');
            }

            // 찾은 GroupEvent의 속성을 업데이트합니다.
            const updatedGroupEvent = this.groupEventRepository.merge(groupEventToUpdate, updateData);
            updatedGroupEvent.updatedAt = new Date();
            // 변경된 GroupEvent를 저장합니다.
            const modifiedGroupEvent = await this.groupEventRepository.save(updatedGroupEvent);
            return modifiedGroupEvent;
        } catch (e) {
            console.error('Error occurred:', e);
            throw new InternalServerErrorException('Failed to modify group event');
        }
    }



    // 그룹 이벤트 삭제
    async removeGroupEvent( groupEventId : string ): Promise<GroupEvent> {
        try {
        
            const groupEvent = await this.groupEventRepository.findOne({
                where: { groupEventId: groupEventId },
            });

            if (!groupEvent) {
                throw new Error('Group event not found');
            }

            if (groupEvent.deactivatedAt === true) {
                throw new Error('Already removed group event');
            }
            groupEvent.deactivatedAt = true;

            const updatedGroupEvent = await this.groupEventRepository.save(groupEvent);
            return updatedGroupEvent;
        } catch (e) {
            console.error('Error occurred:', e);
            throw new InternalServerErrorException('Failed to deactivate group event');
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

