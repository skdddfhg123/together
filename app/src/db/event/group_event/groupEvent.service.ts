import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { CreateGroupEventDTO } from "./dtos/groupEvent.create.dto";
import { PayloadResponse } from "src/auth/dtos/payload-response";
import { GroupEvent } from "./entities/groupEvent.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Calendar } from "src/calendar/entities/calendar.entity";


@Injectable()
export class GroupEventService {
    constructor (
        @ InjectRepository(GroupEvent)
        private readonly groupEventRepository: Repository<GroupEvent>,
        @ InjectRepository(Calendar)
        private readonly calendarRepository: Repository<Calendar>,
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

    async getAllGroupEventsByCalendarId(CalendarId: string): Promise<GroupEvent[]> {
        try {
            console.log(CalendarId)
            const groupEvents = await this.groupEventRepository.find({
                where: {
                    calendarId: CalendarId,
                    isDeleted: false
                },
                order: {
                    startAt: 'ASC'
                }
            });
            return groupEvents;
        } 
        catch (e) {
          throw new InternalServerErrorException(`Failed to fetch group events for calendar ID ${CalendarId}`);
        }
    }


     async getGroupEvent( groupEventId : string ): Promise<GroupEvent> {
    
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
            const groupEventToUpdate = await this.groupEventRepository.findOne({ where: { groupEventId } });
    
            if (!groupEventToUpdate) {
                throw new NotFoundException('Group event not found');
            }
    
            const updatedGroupEvent = this.groupEventRepository.merge(groupEventToUpdate, updateData);
            updatedGroupEvent.updatedAt = new Date();
            return await this.groupEventRepository.save(updatedGroupEvent);
        } catch (e) {
            console.error('Error occurred while updating the group event:', e);
            throw new InternalServerErrorException('Failed to modify group event');
        }
    }
    
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
            groupEvent.deletedAt = new Date();
    
            const updatedGroupEvent = await this.groupEventRepository.save(groupEvent);
            return updatedGroupEvent;
        } catch (e) {
            console.error('Error occurred:', e);
            throw new InternalServerErrorException('Failed to mark group event as deleted');
        }
    }
    
    async findOne(data: Partial<GroupEvent>): Promise<GroupEvent> {
        const groupEvent = await this.groupEventRepository.findOneBy({ groupEventId: data.groupEventId });
        if (!groupEvent) {
            throw new UnauthorizedException('Could not find group event');
        }
        return groupEvent;
    }

}

