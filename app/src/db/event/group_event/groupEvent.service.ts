import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { CreateGroupEventDTO } from "./dtos/groupEvent.create.dto";
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
        // @ InjectRepository(GroupEvent)
        // private readonly groupEventRepository: Repository<GroupEvent>,
        // @InjectRepository(UserCalendar)
        // private userCalendarRepository: Repository<UserCalendar>,
        // @ InjectRepository(User)
        // private readonly userRepository: Repository<User>,
        // private userService: UserService,
        // private userCalendarService: UserCalendarService,
        // private readonly jwtService: JwtService,
    ) {}

    // create (그룹 이벤트 생성)
    async createGroupEvent( userCreateGroupEventDTO : CreateGroupEventDTO): Promise<void/*GroupEvent*/> {
        // const groupEvent = new GroupEvent();
        // //groupEvent.user = user;

        // // 유저 캘린더 relation 으로 userId, userCalendar 추가 
        // // const decodedToken = this.jwtService.verify(token);
        // // const user = await this.userService.findOne({ useremail: decodedToken.sub });
        
        // const user = await this.userService.findOne({useremail : useremail})
        // if (!user) {
        //     throw new InternalServerErrorException('User not found');
        // }

        // groupEvent.author = user.userId;
        // //const userCalendarId = userCreateGroupEventDTO.userCalendarId;
        // const userCalendar = await this.userCalendarService.findOne({ user : user});
        // if (!userCalendar) {
        //     throw new InternalServerErrorException('UserCalendar not found');
        // }
        // groupEvent.userCalendar = userCalendar;

        // // createdAt 현재 시각
        // //groupEvent.createdAt = Date()
        // // start -> startTimeZone
        // //groupEvent.startTimeZone = userCreateGroupEventDTO.startAt;
        // // end -> endTimeZone
        // //groupEvent.endTimeZone = userCreateGroupEventDTO.endAt;
        // // update === createdAt 
        // //groupEvent.updatedAt = Date()

        // try {
        //     const savedGroupEvent = await this.groupEventRepository.save(groupEvent);
        //     return savedGroupEvent;
        // } catch (e) {
        //     console.error('Error occurred:', e);
        //     throw new InternalServerErrorException('Failed to create group event');
        // }
    }


    // 그룹 이벤트 수정 get
    // async updateGetGroupEvent(groupEventId: string): Promise<GroupEvent> {
    //     try {
    //         // 해당 ID의 GroupEvent를 찾습니다.
    //         const groupEventToUpdate = await this.groupEventRepository.findOne({ where: { groupEventId: groupEventId } });

    //         if (!groupEventToUpdate) {
    //             throw new Error('Group event not found');
    //         }

    //         // 찾은 GroupEvent의 속성을 업데이트합니다.
    //         const updatedGroupEvent = this.groupEventRepository.merge(groupEventToUpdate, updateData);
    //         updatedGroupEvent.updatedAt = new Date();
    //         // 변경된 GroupEvent를 저장합니다.
    //         const modifiedGroupEvent = await this.groupEventRepository.save(updatedGroupEvent);
    //         return modifiedGroupEvent;
    //     } catch (e) {
    //         console.error('Error occurred:', e);
    //         throw new InternalServerErrorException('Failed to modify group event');
    //     }
    // }


    
    // 그룹 이벤트 수정 post
    
    // async updateGroupEvent(updateData: Partial<GroupEvent>): Promise<GroupEvent> {
    //     try {
    //         // 해당 ID의 GroupEvent를 찾습니다.
    //         const groupEventToUpdate = await this.groupEventRepository.findOne({ where: { groupEventId: groupEventId } });

    //         if (!groupEventToUpdate) {
    //             throw new Error('Group event not found');
    //         }

    //         // 찾은 GroupEvent의 속성을 업데이트합니다.
    //         const updatedGroupEvent = this.groupEventRepository.merge(groupEventToUpdate, updateData);
    //         updatedGroupEvent.updatedAt = new Date();
    //         // 변경된 GroupEvent를 저장합니다.
    //         const modifiedGroupEvent = await this.groupEventRepository.save(updatedGroupEvent);
    //         return modifiedGroupEvent;
    //     } catch (e) {
    //         console.error('Error occurred:', e);
    //         throw new InternalServerErrorException('Failed to modify group event');
    //     }
    // }



    // 그룹 이벤트 삭제
    async removeGroupEvent( groupEventId : string )/*: Promise<GroupEvent>*/ {
        // try {
        //     // 기존의 GroupEvent 레코드를 조회합니다.
        //     const groupEvent = await this.groupEventRepository.findOne({
        //         where: { groupEventId: groupEventId },
        //     });

        //     if (!groupEvent) {
        //         throw new Error('Group event not found');
        //     }

        //     // deactivatedAt 속성을 true로 설정합니다.
        //     groupEvent.deactivatedAt = true;
        //     //groupEvent.updatedAt = new Date(); // 업데이트 시간을 현재 시간으로 설정

        //     // 변경사항을 저장합니다.
        //     const updatedGroupEvent = await this.groupEventRepository.save(groupEvent);
        //     return updatedGroupEvent;
        // } catch (e) {
        //     console.error('Error occurred:', e);
        //     throw new InternalServerErrorException('Failed to deactivate group event');
        // }
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

}

