import { ForbiddenException, Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { CreateEmojiDTO } from "./dtos/emoji.create.dto";
import { PayloadResponse } from "src/auth/dtos/payload-response";
import { UserService } from "src/db/user/user.service";
import { Calendar } from "src/calendar/entities/calendar.entity";
import { Repository } from "typeorm";
import { Emoji } from "./entities/emoji.entity";
import { ImageService } from "src/image.upload/image.service";


@Injectable()
export class EmojiService { 
  constructor (
        @ InjectRepository(Calendar)
        private readonly calendarRepository: Repository<Calendar>,
        @ InjectRepository(Emoji)
        private readonly emojiRepository: Repository<Emoji>,
        private userService: UserService,
        private imageService: ImageService,

    ) {}

    async createEmoji (  
        body: CreateEmojiDTO,
        payload: PayloadResponse,
        calendarId: string,
        emojiFile: Express.Multer.File
    ):Promise<Emoji> {
        try{
            // 이모지가 저장된 그룹 캘린더 특정 
            const calendar = await this.calendarRepository.findOneBy({ calendarId: calendarId });
            if (!calendar) {
                throw new NotFoundException('Calendar not found');
            }
            // 이모지를 저장할 유저 불러오기
            const user = await this.userService.findOne({useremail : payload.useremail})
            if (!user) {
                throw new UnauthorizedException('User not found');
            }
            if (!calendar.attendees.includes(payload.userCalendarId)) {
                throw new ForbiddenException('You do not have permission to add an event to this calendar');
            }
            
            const emoji = new Emoji();
            emoji.user = user;
            emoji.calendar = calendar;
            emoji.emojiName = body.emojiName;
            const imageUrl = await this.imageService.imageUpload(emojiFile);
            
            return await this.emojiRepository.save(emoji);

        } catch (e) {
            console.error('Error saving emoji:', e);
            throw new InternalServerErrorException('Error saving emoji');
        }
    }













}