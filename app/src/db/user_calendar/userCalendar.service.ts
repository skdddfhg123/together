import { Injectable, InternalServerErrorException, UnauthorizedException } from "@nestjs/common";
import { UserCalendar } from "./entities/userCalendar.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "../user/entities/user.entity";
import { UserService } from "../user/user.service";

@Injectable()
export class UserCalendarService {
    constructor (
        @ InjectRepository(UserCalendar)
        private readonly userCalendarRepository: Repository<UserCalendar>,
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
}
