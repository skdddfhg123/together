import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { UserCalendar } from "./entities/userCalendar.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";
import { PayloadResponse } from "src/auth/dtos/payload-response";
import { SocialEvent } from "../event/socialEvent/entities/socialEvent.entity";

@Injectable()
export class UserCalendarService {
    constructor (
        @ InjectRepository(UserCalendar)
        private readonly userCalendarRepository: Repository<UserCalendar>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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
            // 사용자 엔티티에 사용자 캘린더 엔티티의 참조 추가
            user.userCalendarId = userCalendar;

            // 사용자 엔티티를 업데이트하여 변경 사항 저장
            await this.userRepository.save(user);

            return savedUserCalendar;
        } catch (e) {
            console.error('Error occurred:', e);
            throw new InternalServerErrorException('Failed to create user calendar');
        }
    } 

    // find
    async findOne(data: Partial<UserCalendar>): Promise<UserCalendar> {
        const user = await this.userCalendarRepository.findOneBy({ userCalendarId: data.userCalendarId });

        if (!user) {
            throw new UnauthorizedException('userCalendar findOne : Could not find user');
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

    async findCalendarByUserCalendarId(userCalendarId: string): Promise<UserCalendar> {
        try {
            const userCalendar = await this.userCalendarRepository.findOne({
                where:{ userCalendarId: userCalendarId } 
            });
        
            if (!userCalendar) {
                throw new UnauthorizedException(`UserCalendar not found for user ID: ${userCalendarId}`);
            }
        
            return userCalendar;
        } catch (error) {
            console.error('Error occurred:', error);
            throw new InternalServerErrorException('Failed to find user calendar');
        }
    }
}